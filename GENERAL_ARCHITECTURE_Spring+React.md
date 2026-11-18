# ARCHITECTURE.md — Spring Boot Modular Monolith + Next.js

> **Đối tượng đọc:** AI coding agent / developer sẽ khởi tạo và xây dựng dự án.
> **Ngôn ngữ:** mô tả bằng tiếng Việt; tên package, class, endpoint, code bằng tiếng Anh.
> **Trạng thái:** v2 — bản tối ưu từ `SpringBoot_NextJS_Architecture_Playbook.docx`.
> **Lưu ý về domain:** danh sách module (`user, auth, product, order, payment, notification`) lấy theo ví dụ e-commerce trong Playbook. Nếu domain thật khác, **đổi tên module nhưng giữ nguyên toàn bộ quy tắc** trong tài liệu này.

---

## 0. Quy tắc bắt buộc cho agent (đọc trước)

**MUST**
1. Backend là **một Spring Boot app (một deployable, một database)** chia theo **module nghiệp vụ**, ranh giới module được **kiểm tra tự động** bằng Spring Modulith (`ApplicationModules.verify()` chạy trong CI).
2. Module chỉ gọi nhau qua **public API ở root package của module** (facade interface, event, record DTO công khai). Không import class trong sub-package của module khác.
3. Tham chiếu chéo module **bằng ID** (UUID), không `@ManyToOne` / FK / JOIN xuyên module.
4. Controller **không bao giờ** nhận hoặc trả JPA Entity. Dùng `record` request/response + Bean Validation.
5. Lỗi trả theo **RFC 9457 Problem Details** (`application/problem+json`). Response thành công trả **resource trực tiếp**, không bọc `ApiResponse<T>`.
6. Schema DB do **Flyway** quản lý; `spring.jpa.hibernate.ddl-auto=validate`; `spring.jpa.open-in-view=false`.
7. Frontend: **Server Components là mặc định**; chỉ thêm `"use client"` ở component lá cần tương tác. Kiểu API sinh tự động từ OpenAPI, không viết tay.
8. Mọi thứ chạy local bằng **một lệnh** (`docker compose up`) và có CI chạy lint + test + build cho cả hai phía.
9. Mỗi phase trong mục 9 phải đạt **Acceptance criteria** trước khi sang phase kế tiếp.

**MUST NOT**
- Không thêm **Kafka, Kubernetes, microservice, API Gateway riêng** ở các phase 0–6 (xem mục 8 để biết khi nào mới thêm).
- Không tạo package `util` / `helper` / `common` kiểu “bãi rác”. Mã dùng chung phải có chỗ đúng (mục 4.1).
- Không dùng `@Data` của Lombok trên Entity; không `FetchType.EAGER`; không `@Transactional` ở controller.
- Không lưu JWT/token trong `localStorage`/`sessionStorage`.
- Không commit secret; mọi cấu hình nhạy cảm qua biến môi trường.
- Không tự ý đổi quyết định kiến trúc ở mục 1; nếu thấy vướng, ghi ADR đề xuất trong `docs/adr/` rồi hỏi người dùng.

---

## 1. Bối cảnh, mục tiêu và quyết định kiến trúc

### 1.1 Giả định
- Team 1–5 dev, ≤ ~100k user, một region, lưu lượng vừa phải.
- Ưu tiên: **dễ hiểu, dễ sửa, ranh giới rõ, có đường lui sang microservice** — không ưu tiên “trông hiện đại”.

### 1.2 Bảng quyết định (ADR tóm tắt)

| # | Quyết định | Lý do ngắn gọn | Khi nào xem lại |
|---|---|---|---|
| D1 | Modular Monolith + Spring Modulith | Một deploy, ranh giới được compiler/test kiểm tra | Khi có tiêu chí tách ở mục 8 |
| D2 | Package-by-module, **bên trong module chia lớp nhẹ** (`web/application/domain/infrastructure`) | Gom code theo nghiệp vụ nhưng vẫn giữ hướng phụ thuộc | — |
| D3 | “Pragmatic Clean Architecture”: **JPA Entity = Domain Aggregate** (không tách model persistence riêng) | Tránh nhân đôi model/mapper khi chưa cần | Khi domain phức tạp, cần đổi ORM |
| D4 | Giao tiếp module: **gọi facade đồng bộ** (truy vấn/lệnh cần kết quả) + **event in-process** (phản ứng phụ) | Đơn giản, giữ transaction rõ ràng | Khi tách module ra service |
| D5 | Event dùng **Modulith Event Publication Registry** (transactional outbox sẵn có), Kafka chỉ là bước *externalize* sau này | Tránh lỗi “ghi DB xong nhưng publish Kafka hỏng” | Khi có consumer ngoài process |
| D6 | Reverse proxy (Nginx/Ingress) thay cho “API Gateway” | Monolith không cần gateway; Nginx chỉ làm routing/TLS/rate-limit | Khi có nhiều backend service |
| D7 | Browser → **cùng origin** (`/api/*` → Spring, còn lại → Next.js) | Không CORS, cookie httpOnly hoạt động tự nhiên | — |
| D8 | Auth: Spring Security **OAuth2 Resource Server (JWT)**, token trong **httpOnly cookie** | Giảm rủi ro XSS lấy token; dùng cơ chế chuẩn thay filter tự viết | Khi cần SSO/social/MFA → cân nhắc Keycloak |
| D9 | Cache: **Spring Cache + Caffeine** trước; thêm **Redis** khi chạy >1 instance hoặc cần rate-limit/phiên phân tán | Tránh thêm hạ tầng sớm | Khi scale ngang |
| D10 | Hợp đồng FE–BE là **OpenAPI** → sinh TypeScript client | Hết lệch kiểu giữa hai phía | — |
| D11 | Triển khai ban đầu: **Docker Compose / một VM / PaaS**; K8s khi có nhu cầu thực | K8s tốn vận hành với team nhỏ | Khi cần autoscale, nhiều môi trường |

---

## 2. Tech stack & phiên bản

> Agent: dùng **Spring Initializr** và **create-next-app** để sinh khung, sau đó **ghim phiên bản patch mới nhất ổn định** tại thời điểm khởi tạo và ghi vào README. Không dùng bản milestone/RC/preview.

| Thành phần | Chọn | Ghi chú |
|---|---|---|
| Java | **25 LTS** (tối thiểu 21) | Bật virtual threads: `spring.threads.virtual.enabled=true` |
| Spring Boot | **4.1.x** (dòng ổn định; 4.2 đang ở giai đoạn RC) | Spring Framework 7. Đọc *Spring Boot 4.0 Migration Guide* trước khi code (Jackson 3, starter đã modular hoá, v.v.) |
| Spring Modulith | **2.x** (tương thích Boot 4) | `starter-core`, `starter-jpa` (event registry), `starter-test` |
| Build | Maven (wrapper) | Một module Maven cho backend (đừng tách multi-module Maven khi chưa cần) |
| DB | PostgreSQL 17+ | Một database, **mỗi module một schema** |
| Migration | Flyway | |
| Mapping | MapStruct (module phức tạp) / mapper tay (module nhỏ) | Cấu hình đúng thứ tự annotation processor nếu dùng cùng Lombok |
| API docs | springdoc-openapi (bản tương thích Boot 4) | Xuất `openapi.json` |
| Test | JUnit 5, Testcontainers (Postgres), ArchUnit, Spring Modulith test | |
| Frontend | **Next.js 16.x (App Router)**, React 19, TypeScript `strict` | Node.js LTS (≥ 22) |
| UI | Tailwind CSS 4 + shadcn/ui | |
| Server state | TanStack Query v5 (chỉ phía client cần tương tác) | |
| Form/validation | React Hook Form + Zod | |
| API client | `openapi-typescript` + `openapi-fetch` | |
| FE test | Vitest + Testing Library; Playwright (E2E) | |
| Package manager | pnpm | |
| Hạ tầng dev | Docker Compose: postgres, backend, frontend, nginx, mailpit (+ redis, kafka theo profile) | |

---

## 3. Kiến trúc tổng thể

```
                 ┌───────────────────────────── Internet ─────────────────────────────┐
                 │                                                                    │
                 ▼                                                                    │
        ┌───────────────────┐                                                         │
        │ Nginx / Ingress   │  TLS, gzip, rate-limit, security headers                │
        │ (reverse proxy)   │                                                         │
        └───────┬─────┬─────┘                                                         │
          /api/*│     │ /* (còn lại)                                                  │
                ▼     ▼                                                               │
   ┌─────────────────┐ ┌──────────────────────┐   RSC/Server Actions gọi nội bộ       │
   │ Spring Boot     │◀┤ Next.js (App Router) │   http://backend:8080 (forward cookie)│
   │ Modular Monolith│ │ SSR / RSC / BFF nhẹ  │                                       │
   │                 │ └──────────────────────┘                                       │
   │  iam: user/auth │                                                                │
   │  catalog        │         ┌───────────────┐                                      │
   │  ordering       │────────▶│ PostgreSQL    │ 1 DB, nhiều schema                   │
   │  payment        │         └───────────────┘                                      │
   │  notification   │────────▶ Caffeine (L1) ──(khi scale ngang)──▶ Redis (L2)       │
   └─────────────────┘────────▶ (Tùy chọn, về sau) Kafka cho event ra ngoài process   │
```

**Luồng request điển hình**
1. Trình duyệt → `https://app.example.com/orders` → Nginx → Next.js.
2. Server Component của Next.js gọi `http://backend:8080/api/v1/orders` (mạng nội bộ), **forward header `Cookie`** của người dùng.
3. Spring xác thực JWT từ cookie → Controller → Application Service → Domain → Repository → PostgreSQL.
4. Component client (nếu cần) gọi trực tiếp `/api/v1/...` cùng origin; cookie tự gắn.

---

## 4. Backend

### 4.1 Cấu trúc thư mục

```
backend/
├── pom.xml
├── mvnw
└── src
    ├── main
    │   ├── java/com/myapp                      # đổi base package theo dự án
    │   │   ├── MyAppApplication.java
    │   │   ├── shared/                         # Shared Kernel – cực nhỏ, ổn định (OPEN module)
    │   │   │   ├── error/                      #   ErrorCode, BusinessException, ProblemTypes
    │   │   │   ├── web/                        #   PageResponse<T>, IdempotencyKey, request id
    │   │   │   └── domain/                     #   Money, các value object dùng chung
    │   │   ├── platform/                       # Hạ tầng kỹ thuật xuyên suốt (OPEN module)
    │   │   │   ├── config/                     #   Jackson, Async, OpenAPI, Cache, CORS(nếu cần)
    │   │   │   ├── security/                   #   SecurityFilterChain, JwtDecoder/Encoder, cookie utils
    │   │   │   ├── web/                        #   GlobalExceptionHandler (ProblemDetail), Origin check filter
    │   │   │   ├── persistence/                #   AuditingEntity (createdAt, updatedAt, version)
    │   │   │   └── storage/ mail/ sms/         #   adapter dùng chung (S3, SMTP…) – chỉ khi >1 module cần
    │   │   ├── iam/                            # (tuỳ chọn) nhóm user+auth nếu muốn một module
    │   │   ├── user/                           # module nghiệp vụ
    │   │   ├── auth/
    │   │   ├── product/
    │   │   ├── order/
    │   │   ├── payment/
    │   │   └── notification/
    │   └── resources
    │       ├── application.yml
    │       ├── application-dev.yml / application-prod.yml
    │       └── db/migration/                   # Flyway: V<yyyyMMddHHmm>__<module>_<mô_tả>.sql
    └── test/java/com/myapp
        ├── ModularityTests.java                # ApplicationModules.verify()
        ├── ArchitectureTests.java              # ArchUnit rules bổ sung
        └── <module>/...                        # test theo module
```

**Ánh xạ từ Playbook cũ**

| Playbook cũ | Bản mới | Lý do |
|---|---|---|
| `common` (exception, response, constants, util, mapper, validator, annotation) | `shared` (chỉ error/web/domain) | `util/constants/mapper` là bãi rác; mã chỉ một module dùng thì để trong module đó |
| `config` + `security` + `infrastructure` (cấp cao nhất) | `platform` | Gom hạ tầng kỹ thuật xuyên suốt, tránh tái tạo “package-by-layer” ở cấp cao nhất |
| `infrastructure/payment` (VNPayClient), `infrastructure/email`… | Adapter **nằm trong module sở hữu** (`payment/infrastructure/VnPayClient`) | Adapter thuộc nghiệp vụ nào thì ở module đó; chỉ adapter dùng chung mới lên `platform` |
| `security/CustomUserDetailsService`, `JwtFilter` tự viết | Resource Server + `auth` module | Dùng cơ chế chuẩn của Spring Security; use case login/refresh thuộc `auth`, cấu hình kỹ thuật thuộc `platform/security` |

### 4.2 Giải phẫu một module

```
order/
├── package-info.java            # @ApplicationModule(allowedDependencies = {...})
├── OrderApi.java                # PUBLIC: facade cho module khác (interface)
├── OrderPlacedEvent.java        # PUBLIC: event (record), bất biến
├── OrderSummary.java            # PUBLIC: DTO chỉ-đọc cho module khác (record)
│
├── web/                         # INTERNAL – adapter HTTP
│   ├── OrderController.java
│   ├── CreateOrderRequest.java  #   record + Bean Validation
│   ├── OrderResponse.java       #   record
│   └── OrderWebMapper.java
├── application/                 # INTERNAL – use case, @Transactional, điều phối
│   ├── OrderService.java        #   implements OrderApi
│   ├── PlaceOrderCommand.java
│   └── PaymentEventsListener.java   # @ApplicationModuleListener
├── domain/                      # INTERNAL – nghiệp vụ lõi
│   ├── Order.java               #   Aggregate Root (JPA Entity, có hành vi)
│   ├── OrderLine.java
│   ├── OrderStatus.java
│   ├── OrderRepository.java     #   Spring Data interface
│   └── PricingPolicy.java       #   Domain service: chỉ khi logic vắt qua nhiều aggregate
└── infrastructure/              # INTERNAL – adapter ra ngoài module (nếu cần)
    └── ...
```

**Quy tắc**
- **Public API = chỉ những type nằm ở root package của module.** Sub-package là internal dù Java để `public` (Modulith sẽ báo lỗi nếu module khác chạm vào).
- Hướng phụ thuộc trong module: `web → application → domain`; `infrastructure → domain`. `domain` **không** import `web`, **không** import Spring MVC.
- **Entity có hành vi** (không để thuần getter/setter): bất biến nghiệp vụ nằm trong aggregate (`order.markPaid()`, `order.cancel()`), không rải ở service.
- **Domain Service** chỉ tạo khi logic không thuộc về một aggregate nào (vd. tính giá/khuyến mãi). Nếu không có logic như vậy, **không tạo class rỗng cho đủ lớp**.
- **Module CRUD đơn giản** (vd. `notification`, cấu hình, danh mục) được phép rút gọn: `web/` + `application/` + `persistence` — không bắt buộc `domain/` riêng. Đừng over-engineer.

### 4.3 Danh sách module & luật phụ thuộc

| Module | Trách nhiệm | Schema DB | Được phụ thuộc vào |
|---|---|---|---|
| `shared` | Kernel dùng chung (error, Money, PageResponse) | — | — |
| `platform` | Cấu hình/hạ tầng kỹ thuật | — | `shared` |
| `user` | Hồ sơ, trạng thái, vai trò người dùng | `iam` | `shared`, `platform` |
| `auth` | Đăng ký/đăng nhập/refresh/logout, phát hành JWT | `iam` | `user`, `shared`, `platform` |
| `product` | Danh mục, sản phẩm, tồn kho | `catalog` | `shared`, `platform` |
| `payment` | Khởi tạo thanh toán, adapter VNPay/…, xử lý IPN/webhook | `payment` | `shared`, `platform` *(chỉ biết `orderId` như ID mờ)* |
| `order` | Đặt hàng, trạng thái đơn | `ordering` | `user`, `product`, `payment`, `shared`, `platform` |
| `notification` | Gửi email/SMS/push theo event | `notification` | `user`, `order`, `payment` *(chỉ để nghe event)*, `shared`, `platform` |

**Đồ thị phụ thuộc phải là DAG (không vòng).** Không module nào được phụ thuộc `notification`. Nếu vòng xuất hiện (vd. `order ⇄ payment`), giải bằng: *một chiều gọi facade, chiều ngược lại dùng event* (xem 4.4).

`package-info.java` mẫu:

```java
@org.springframework.modulith.ApplicationModule(
    displayName = "Ordering",
    allowedDependencies = { "user", "product", "payment", "shared", "platform" }
)
package com.myapp.order;
```

Test bắt buộc:

```java
class ModularityTests {
    static final ApplicationModules modules = ApplicationModules.of(MyAppApplication.class);

    @Test void verifiesModuleStructure() { modules.verify(); }          // chặn vòng + truy cập internal

    @Test void writesDocumentation() {                                   // sinh sơ đồ vào target/
        new Documenter(modules).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml();
    }
}
```

### 4.4 Giao tiếp giữa các module

| Tình huống | Cơ chế | Ví dụ |
|---|---|---|
| Cần **kết quả ngay**, cùng transaction | Gọi facade (`ProductApi`, `UserApi`, `PaymentApi`) | `order` gọi `ProductApi.reserveStock(...)` |
| **Phản ứng phụ**, không cần kết quả | Event in-process + `@ApplicationModuleListener` | `OrderPlacedEvent` → `notification` gửi email |
| Module A cần **dữ liệu của B** để hiển thị | Gọi facade trả `record` read-only; **không** JOIN xuyên schema | `order` lấy tên sản phẩm qua `ProductApi.getSummaries(ids)` |

Quy tắc event:
- Event là `record` **bất biến**, đặt ở root package của module phát hành, chứa **ID + dữ liệu tối thiểu**, không chứa Entity.
- Listener dùng `@ApplicationModuleListener` (chạy bất đồng bộ, transaction riêng, kết hợp event publication registry → **không mất event** khi lỗi/restart). Listener phải **idempotent** (event có thể được gửi lại).
- Publish bằng `ApplicationEventPublisher` **bên trong** transaction nghiệp vụ.
- Cấu hình registry bằng `spring-modulith-starter-jpa`; bật cơ chế retry/resubmit incomplete publications khi khởi động.
- **Kafka**: chỉ thêm khi cần chuyển event ra ngoài process — đánh dấu event bằng `@Externalized("topic::key")` thay vì tự viết `KafkaTemplate` rải rác.

**Ví dụ luồng đặt hàng (không vòng phụ thuộc)**
```
POST /api/v1/orders
  └─ OrderService.place()  [@Transactional]
       ├─ ProductApi.reserveStock(items)          (order → product)
       ├─ Order.place(...) + PricingPolicy        (domain)
       ├─ orderRepository.save(order)  status=PENDING_PAYMENT
       └─ publish OrderPlacedEvent                → notification (email "đã nhận đơn")

POST /api/v1/orders/{id}/payments
  └─ PaymentApi.initiate(orderId, amount)         (order → payment) → trả URL VNPay

VNPay IPN → POST /api/v1/payments/vnpay/ipn
  └─ PaymentService.handleIpn()  (verify chữ ký, idempotent theo txnRef)
       └─ publish PaymentSucceededEvent           → order (markPaid) → publish OrderPaidEvent → notification
```

### 4.5 Skeleton mã (Order) — làm mẫu cho mọi module

```java
// web/OrderController.java
@RestController
@RequestMapping("/api/v1/orders")
class OrderController {
    private final OrderService service;
    private final OrderWebMapper mapper;

    OrderController(OrderService service, OrderWebMapper mapper) { this.service = service; this.mapper = mapper; }

    @PostMapping
    ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req,
                                         @RequestHeader("Idempotency-Key") String idemKey,
                                         @AuthenticationPrincipal Jwt jwt) {
        var order = service.place(new PlaceOrderCommand(UUID.fromString(jwt.getSubject()), req.items(), idemKey));
        return ResponseEntity.created(URI.create("/api/v1/orders/" + order.getId())).body(mapper.toResponse(order));
    }

    @GetMapping("/{id}")
    OrderResponse get(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        return mapper.toResponse(service.getOwned(id, UUID.fromString(jwt.getSubject())));
    }
}

// web/CreateOrderRequest.java
public record CreateOrderRequest(
    @NotEmpty @Size(max = 100) List<@Valid Item> items) {
    public record Item(@NotNull UUID productId, @Min(1) @Max(1000) int quantity) {}
}
```

```java
// application/OrderService.java
@Service
public class OrderService implements OrderApi {
    private final OrderRepository orders;
    private final ProductApi products;               // module khác: chỉ qua facade
    private final PricingPolicy pricing;
    private final ApplicationEventPublisher events;

    // ctor injection …

    @Transactional
    public Order place(PlaceOrderCommand cmd) {
        var existing = orders.findByUserIdAndIdempotencyKey(cmd.userId(), cmd.idempotencyKey());
        if (existing.isPresent()) return existing.get();                 // idempotent

        var reserved = products.reserveStock(cmd.items());               // ném BusinessException nếu hết hàng
        var total    = pricing.calculate(reserved);
        var order    = Order.place(cmd.userId(), reserved, total, cmd.idempotencyKey());
        orders.save(order);
        events.publishEvent(new OrderPlacedEvent(order.getId(), order.getUserId(), total.amount(), total.currency(), Instant.now()));
        return order;
    }

    @Transactional
    public void markPaid(UUID orderId) { orders.findById(orderId).orElseThrow(OrderError.NOT_FOUND::exception).markPaid(); }
}

// application/PaymentEventsListener.java
@Component
class PaymentEventsListener {
    private final OrderService service;
    PaymentEventsListener(OrderService service) { this.service = service; }

    @ApplicationModuleListener
    void on(PaymentSucceededEvent e) { service.markPaid(e.orderId()); }   // idempotent: markPaid() bỏ qua nếu đã PAID
}
```

```java
// domain/Order.java  (rút gọn)
@Entity
@Table(schema = "ordering", name = "orders")
public class Order extends AuditingEntity {
    @Id private UUID id;
    @Column(nullable = false) private UUID userId;                 // tham chiếu bằng ID, KHÔNG @ManyToOne User
    @Enumerated(EnumType.STRING) private OrderStatus status;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id") private List<OrderLine> lines = new ArrayList<>();
    @Embedded private Money total;
    private String idempotencyKey;
    @Version private long version;

    protected Order() {}                                           // JPA
    public static Order place(UUID userId, List<OrderLine> lines, Money total, String key) { /* validate invariants */ }
    public void markPaid() {
        if (status == OrderStatus.PAID) return;                    // idempotent
        if (status != OrderStatus.PENDING_PAYMENT) throw OrderError.INVALID_STATE.exception(status);
        status = OrderStatus.PAID;
    }
}
```

### 4.6 Persistence

- **Một database, mỗi module một schema:** `iam`, `catalog`, `ordering`, `payment`, `notification` (+ bảng event publication của Modulith ở schema mặc định). Mỗi module **chỉ truy cập schema của mình**.
- **Không FK / JOIN xuyên schema.** Muốn dữ liệu module khác → gọi facade. Đây là điều kiện để về sau tách module ra service mà không đập lại DB.
- ID: **UUID** (ưu tiên v7, sinh ở phía ứng dụng). Tiền: `BigDecimal` + `currency` đóng gói trong `Money`; không dùng `double`. Thời gian: `Instant` (UTC), cột `timestamptz`.
- **Optimistic locking** (`@Version`) cho aggregate có cập nhật đồng thời (order, stock).
- Chống N+1: dùng `@EntityGraph`/fetch join có chủ đích, projection (interface/record) cho truy vấn đọc; bật `hibernate.default_batch_fetch_size`.
- **Flyway:** tên file `V202611180900__ordering_create_orders.sql` (timestamp tránh đụng version giữa các nhánh). Không sửa migration đã merge; luôn tạo migration mới.
- Truy vấn đọc nặng/báo cáo: dùng projection hoặc `JdbcClient` trong module sở hữu dữ liệu — không phá ranh giới module.

### 4.7 API convention

- Prefix **`/api/v1`**. Tài nguyên danh từ số nhiều, kebab-case: `/api/v1/orders`, `/api/v1/orders/{id}/payments`.
- Method: `GET` đọc, `POST` tạo / hành động, `PUT` thay thế toàn bộ, **`PATCH` cập nhật một phần**, `DELETE` xoá. Dùng mã HTTP đúng nghĩa (201 + `Location`, 204, 409, 422…).
- **Thành công:** trả resource trực tiếp.
  Danh sách phân trang:
  ```json
  { "items": [ ... ], "page": { "number": 0, "size": 20, "totalElements": 134, "totalPages": 7 } }
  ```
  (Danh sách lớn/feed: dùng cursor `{ "items": [...], "nextCursor": "..." }`.)
- **Lỗi:** RFC 9457, `Content-Type: application/problem+json`:
  ```json
  {
    "type": "https://api.myapp.com/problems/order-not-found",
    "title": "Order not found",
    "status": 404,
    "detail": "Order 7f3a... does not exist",
    "instance": "/api/v1/orders/7f3a...",
    "code": "ORDER_NOT_FOUND",
    "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
    "errors": [ { "field": "items[0].quantity", "code": "Min", "message": "must be >= 1" } ]
  }
  ```
  - Mỗi module định nghĩa `enum XxxError implements ErrorCode` (code + HTTP status + title). Ném `BusinessException(ErrorCode, args...)`.
  - `GlobalExceptionHandler` (`platform/web`, `@RestControllerAdvice`) map: `BusinessException`, `MethodArgumentNotValidException`, `AccessDeniedException`, `OptimisticLockingFailureException` (→ 409), và fallback 500 **không lộ stack trace**. Luôn kèm `traceId`.
- **Idempotency:** `POST` tạo đơn / khởi tạo thanh toán yêu cầu header `Idempotency-Key`; lưu key + kết quả để retry an toàn. Webhook (VNPay IPN) phải idempotent theo mã giao dịch.
- **Validation:** Bean Validation ở DTO; luật nghiệp vụ ở domain. Không tin dữ liệu client (giá, tổng tiền luôn tính lại ở server).
- **OpenAPI:** mỗi controller có tag, mô tả, ví dụ lỗi; `GET /v3/api-docs` bật ở dev/CI, **tắt hoặc bảo vệ ở prod**.
- (Tuỳ chọn) dùng API versioning native của Spring Framework 7 thay vì tự quản prefix, nếu team đã quen.

### 4.8 Security

- **Spring Security `oauth2ResourceServer(jwt)`** — không viết `JwtFilter` tự chế.
- `auth` module: phát hành **access token (JWT, RS256/ES256, sống ~10–15 phút)** và **refresh token (chuỗi ngẫu nhiên, lưu băm trong DB, xoay vòng mỗi lần dùng, phát hiện tái sử dụng → thu hồi cả họ token)**. Khoá ký đọc từ biến môi trường/secret manager.
- **Cookie:** `access_token` (`HttpOnly; Secure; SameSite=Lax; Path=/`), `refresh_token` (`HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth`). Client không phải (và không được) đọc token bằng JS.
- **CSRF:** vì dùng cookie → cần chống CSRF. Áp dụng: `SameSite=Lax` + **filter kiểm tra `Origin`/`Sec-Fetch-Site` cho method không an toàn** (POST/PUT/PATCH/DELETE) theo allowlist cấu hình; client phi-trình-duyệt dùng `Authorization: Bearer` (được miễn). Nâng cấp lên CSRF token nếu có yêu cầu bảo mật cao hơn.
- **Phân quyền:** vai trò/permission nằm trong claim; kiểm tra bằng `@PreAuthorize` ở **application service** (và/hoặc `SecurityFilterChain` cho nhóm đường dẫn). Quy tắc “chỉ chủ sở hữu được xem đơn” kiểm tra trong service (`getOwned(...)`), không tin ID từ client.
- Mật khẩu: `DelegatingPasswordEncoder` (bcrypt/argon2). Giới hạn đăng nhập sai + rate-limit endpoint `/auth/*` (Nginx, về sau Redis).
- Header bảo mật (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, CSP cho Next.js) cấu hình ở Nginx/Next.
- Secret scanning + dependency scanning (Dependabot/Renovate, `mvn dependency-check` hoặc Trivy) trong CI.

### 4.9 Cache

- Bắt đầu với **Spring Cache + Caffeine** (in-memory, 1 instance). Cấu hình qua abstraction (`@Cacheable/@CacheEvict`) để đổi sang Redis chỉ bằng cấu hình.
- Chuyển/ thêm **Redis** khi: >1 instance backend, hoặc cần rate-limit/khoá phân tán/blacklist token.
- Chỉ cache dữ liệu **đọc nhiều, ít đổi**: danh mục, cấu hình, catalog sản phẩm công khai. **Không cache** dữ liệu theo user nhạy cảm, số dư, tồn kho thời gian thực.
- Quy tắc bắt buộc: **TTL cho mọi cache**; key có tiền tố `myapp:<module>:<name>:<id>`; cache **DTO/record bất biến**, không cache Entity; **evict khi ghi** (qua chính module đó hoặc nghe event); cache permission phải gắn evict khi đổi role.
- Mô hình đọc: Cache → miss → DB → put. Chống stampede cho key nóng (`sync = true`).

### 4.10 Async, scheduling, tích hợp ngoài

- Việc chậm/không cần kết quả ngay (gửi mail, SMS, webhook ngoài) chạy qua **event listener** hoặc `@Async` với executor có giới hạn; bật virtual threads cho I/O.
- Gọi dịch vụ ngoài (VNPay, S3, SMTP): đặt trong `infrastructure` của module sở hữu; có **timeout, retry giới hạn, circuit breaker (Resilience4j)**; không gọi ngoài bên trong transaction DB dài.
- Job định kỳ: `@Scheduled` + khoá (ShedLock) khi chạy >1 instance.

### 4.11 Cấu hình, logging, quan sát

- Profile: `dev`, `test`, `prod`. Mọi giá trị môi trường qua biến môi trường (`SPRING_DATASOURCE_URL`, `APP_JWT_PRIVATE_KEY`, …). Dùng `@ConfigurationProperties` có validate.
- **Actuator:** `/actuator/health/liveness`, `/readiness`, `/prometheus` (chỉ mạng nội bộ). **Micrometer** metrics cho HTTP, DB pool, cache, event publication.
- **Log JSON có cấu trúc** (structured logging của Spring Boot) + `traceId`/`spanId` (Micrometer Tracing/OpenTelemetry); không log dữ liệu nhạy cảm (mật khẩu, token, số thẻ).
- Graceful shutdown: `server.shutdown=graceful`.

### 4.12 Chiến lược kiểm thử backend

| Lớp | Công cụ | Phạm vi |
|---|---|---|
| Ranh giới module | `ApplicationModules.verify()` | Chạy mọi PR |
| Luật kiến trúc | ArchUnit | Controller không trả/nhận `@Entity`; `domain` không import `web`; không `@Transactional` ở `web` |
| Unit | JUnit 5 | Aggregate, domain policy (nhanh, không Spring) |
| Module/Slice | `@ApplicationModuleTest` + Testcontainers Postgres | Từng module cô lập, mock facade module khác |
| Event | Modulith `Scenario` API | Kiểm tra publish/consume event |
| API contract | MockMvc/`RestTestClient` + kiểm tra schema lỗi RFC 9457 | Mỗi endpoint: 2xx, 400, 401, 403, 404, 409 |
| Smoke | Boot + Testcontainers | 1–2 luồng chính end-to-end |

Mục tiêu coverage: **domain/application ≥ 80%**; không đuổi % ở controller mỏng.

---

## 5. Frontend (Next.js App Router)

### 5.1 Cấu trúc thư mục

```
frontend/
├── next.config.ts                 # output: "standalone"
├── package.json
├── e2e/                           # Playwright
└── src/
    ├── app/                       # CHỈ định tuyến & bố cục – mỏng, không chứa logic nghiệp vụ
    │   ├── layout.tsx
    │   ├── (public)/page.tsx
    │   ├── (auth)/login/page.tsx
    │   ├── (app)/                 # vùng cần đăng nhập
    │   │   ├── layout.tsx
    │   │   └── orders/
    │   │       ├── page.tsx       #   Server Component: gọi features/order
    │   │       ├── loading.tsx
    │   │       ├── error.tsx
    │   │       └── [id]/page.tsx
    │   └── api/health/route.ts    # chỉ Route Handler thật sự cần (health, revalidate webhook)
    ├── features/                  # NGHIỆP VỤ – chia theo feature, mirror module backend
    │   ├── auth/
    │   ├── product/
    │   └── order/
    │       ├── api/               #   gọi backend (server + client), query keys
    │       ├── components/        #   UI riêng của feature
    │       ├── hooks/             #   hook client của feature (TanStack Query…)
    │       ├── schemas/           #   Zod schema (form)
    │       ├── actions.ts         #   Server Actions ("use server")
    │       └── index.ts           #   PUBLIC API của feature (chỉ export từ đây)
    ├── shared/                    # KHÔNG biết gì về nghiệp vụ
    │   ├── ui/                    #   shadcn/ui, design system
    │   ├── lib/                   #   http client, env (zod), formatters, cn()
    │   ├── hooks/                 #   hook dùng chung
    │   ├── config/                #   hằng số cấu hình
    │   └── api/schema.d.ts        #   GENERATED từ OpenAPI (không sửa tay)
    └── proxy.ts                   # Next 16 (trước đây middleware.ts): redirect lạc quan + refresh token
```

**So với Playbook cũ:** bỏ các thư mục top-level kiểu layer (`services`, `hooks`, `stores`, `types`, `utils`) — chúng tái tạo đúng vấn đề “package-by-layer” mà Playbook từng phê phán ở backend. `features/<x>/pages` cũng bỏ (đó là tư duy Pages Router; routing nằm ở `app/`).

### 5.2 Luật phụ thuộc (ép bằng ESLint)

```
app      → features, shared
features → shared, (feature khác CHỈ qua features/<x>/index.ts)
shared   → (không import app, không import features)
```
Cấu hình `eslint-plugin-boundaries` (hoặc `no-restricted-imports` / `import/no-restricted-paths`) để **lint fail** khi vi phạm. Cấm import sâu kiểu `features/order/components/Foo` từ ngoài feature.

### 5.3 Quy tắc dữ liệu & render

1. **Mặc định Server Component.** Fetch dữ liệu ở server (cùng server-side với Spring qua mạng nội bộ). Đẩy `"use client"` xuống component lá (nút, form, bảng tương tác).
2. **Hàm gọi backend phía server** nằm trong `features/<x>/api/*.server.ts`, import `server-only`, đọc `cookies()` và **forward `Cookie`** sang Spring. Không để lộ URL/credential nội bộ ra client.
3. **Mutation:** ưu tiên **Server Actions** (form, có revalidate) → gọi Spring → `revalidateTag/revalidatePath`. Dùng **TanStack Query** chỉ cho UI cần tương tác phía client (infinite scroll, polling, optimistic update).
4. **Quản lý state:** *server state* → RSC/TanStack Query; *UI state cục bộ* → `useState`/`useReducer`; *state client toàn cục thật sự cần* → Zustand (nhỏ). **Không** nhét dữ liệu server vào store toàn cục.
5. **Form:** React Hook Form + Zod; lỗi từ Spring (`errors[]` của Problem Details) map ngược về field.
6. **Caching Next.js:** dữ liệu công khai (catalog) dùng cơ chế cache của Next 16 (Cache Components / `use cache` + tag, `revalidateTag` khi cần); dữ liệu theo người dùng là **dynamic**, không cache chung.
7. **Auth ở FE:** `proxy.ts` chỉ làm *kiểm tra lạc quan* (không có cookie → redirect `/login`) và **refresh token** khi access token hết hạn/sắp hết (gọi `/api/v1/auth/refresh`, set cookie vào response). **Quyền thật sự luôn do Spring quyết định**; mọi Server Action/RSC đều xử lý 401/403 từ backend.
8. **Bảo mật:** không `dangerouslySetInnerHTML` trừ khi đã sanitize; CSP header; không để biến môi trường bí mật có tiền tố `NEXT_PUBLIC_`.
9. **Hiệu năng/UX:** `loading.tsx` + `Suspense` cho streaming; `next/image`, `next/font`; theo dõi Core Web Vitals; `error.tsx` + `not-found.tsx` cho mỗi nhóm route chính.
10. **TypeScript `strict`**, cấm `any` ngầm; kiểu request/response lấy từ `shared/api/schema.d.ts`.

### 5.4 Hợp đồng API & sinh client

- Backend xuất OpenAPI → FE chạy `pnpm gen:api` (dùng `openapi-typescript`) tạo `src/shared/api/schema.d.ts`; `shared/lib/http.ts` bọc `openapi-fetch` (base URL theo môi trường: server dùng `BACKEND_INTERNAL_URL`, client dùng `/api`).
- Commit file `openapi.json` snapshot; **CI fail nếu snapshot lệch** với spec sinh từ backend (chống drift).
- Chuẩn hoá lỗi: một hàm `parseProblem(response)` trả về `{code, title, detail, errors}`; UI hiển thị theo `code`, không theo chuỗi `message`.

### 5.5 Kiểm thử frontend

- **Vitest + Testing Library:** component/hook/schema.
- **Playwright (E2E):** luồng đăng nhập → duyệt sản phẩm → đặt hàng → (mock cổng thanh toán). Chạy với backend thật trong Compose ở CI (job riêng).
- Lint: `eslint` (+ boundaries), `prettier`, `tsc --noEmit`.

---

## 6. Hợp đồng Frontend ↔ Backend (tóm tắt)

| Hạng mục | Quy ước |
|---|---|
| Base path | `/api/v1` (cùng origin qua reverse proxy) |
| Xác thực | Cookie httpOnly `access_token` / `refresh_token`; client phi-trình-duyệt: `Authorization: Bearer` |
| Content-Type | `application/json`; lỗi `application/problem+json` |
| Định danh | UUID; thời gian ISO-8601 UTC; tiền: `{ "amount": "199000.00", "currency": "VND" }` (amount dạng chuỗi/BigDecimal) |
| Phân trang | `?page=0&size=20&sort=createdAt,desc` hoặc cursor |
| Idempotency | Header `Idempotency-Key` cho POST tạo đơn/thanh toán |
| Trace | Backend trả `traceId` trong Problem Details và header `X-Request-Id` |
| CORS | Không cần (cùng origin); chỉ bật allowlist nếu có client khác origin |

---

## 7. Hạ tầng & DevOps

### 7.1 Cấu trúc repo (monorepo)

```
repo/
├── backend/
├── frontend/
├── infra/
│   ├── docker-compose.yml          # dev: postgres, backend, frontend, nginx, mailpit
│   ├── docker-compose.override.yml # tuỳ chọn
│   ├── nginx/default.conf
│   └── k8s/                        # CHỈ tạo khi thật sự cần (mục 8)
├── docs/
│   ├── architecture.md             # link tới file này
│   └── adr/0001-....md             # mỗi quyết định lớn một ADR
├── .github/workflows/ (hoặc .gitlab-ci.yml)
├── .env.example
└── README.md
```

### 7.2 Docker Compose (dev)
- Dịch vụ mặc định: `postgres`, `backend`, `frontend`, `nginx`, `mailpit`.
- **Profile tuỳ chọn:** `redis`, `kafka` (không bật mặc định).
- `healthcheck` cho postgres/backend; `depends_on: condition: service_healthy`.
- Backend image: multi-stage hoặc `./mvnw spring-boot:build-image`; chạy **user không phải root**. Frontend dùng `output: "standalone"`.

### 7.3 Nginx (mẫu)

```nginx
upstream frontend { server frontend:3000; }
upstream backend  { server backend:8080; }

limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

server {
  listen 80;

  location /api/v1/auth/ {
    limit_req zone=auth burst=10 nodelay;
    proxy_pass http://backend;
    include /etc/nginx/proxy_params;
  }
  location /api/ {
    proxy_pass http://backend;
    include /etc/nginx/proxy_params;      # Host, X-Forwarded-For/Proto/Host
  }
  location / {
    proxy_pass http://frontend;
    include /etc/nginx/proxy_params;
  }
}
```
Backend: `server.forward-headers-strategy=framework`.

### 7.4 CI/CD (tối thiểu)
- **Backend job:** `./mvnw -B verify` (unit + Modulith verify + ArchUnit + integration/Testcontainers) → build image.
- **Frontend job:** `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `test` → `build`.
- **Contract job:** sinh OpenAPI từ backend, so với `openapi.json` đã commit, **fail nếu lệch**.
- **E2E job** (nhánh chính/nightly): Compose + Playwright.
- **Bảo mật:** dependency scan + secret scan + image scan.
- Môi trường: `dev` → `staging` → `prod`; migration Flyway chạy khi khởi động (hoặc job riêng ở prod); chiến lược rollback = deploy lại image cũ + migration tương thích ngược (expand/contract).

---

## 8. Lộ trình mở rộng & khi nào tách service

**Thứ tự mở rộng (làm khi có số liệu, không làm trước):**
1. Tối ưu truy vấn/index, bật cache (Caffeine).
2. Scale ngang backend (≥2 instance) → thêm **Redis** (cache phân tán, rate-limit, khoá).
3. Tách job nặng sang worker cùng codebase (profile riêng).
4. Đọc nặng → read replica / bảng đọc (projection).
5. **Externalize event ra Kafka** cho consumer ngoài process.
6. Tách module thành service.
7. Chuyển sang Kubernetes khi cần autoscale/đa môi trường/zero-downtime phức tạp.

**Chỉ tách một module thành service khi đáp ứng phần lớn:**
- [ ] Có số liệu chứng minh cần scale riêng (CPU/IO/độ trễ) mà tối ưu trong monolith không đủ.
- [ ] Có team riêng sở hữu module và nhịp release khác biệt.
- [ ] Module đã giao tiếp **chỉ qua facade/event**, `verify()` xanh, **không** FK/JOIN xuyên schema.
- [ ] Module có schema riêng, có thể chuyển sang DB riêng.
- [ ] Đã có observability (tracing phân tán, metrics, log tập trung) và CI/CD tự động.
- [ ] Chấp nhận được độ phức tạp: eventual consistency, retry, idempotency, versioning hợp đồng.

**Cách tách (an toàn):** externalize event module đó ra Kafka → thay facade nội bộ bằng client HTTP/gRPC **cùng interface** → chuyển schema sang DB riêng → deploy service độc lập → xoá code cũ khỏi monolith. **Ứng viên thường gặp:** `notification`, xử lý webhook `payment`, search/analytics.

---

## 9. Kế hoạch triển khai cho agent (theo phase)

> Mỗi phase kết thúc bằng một PR/commit rõ ràng; CI phải xanh. Không bắt đầu phase sau khi phase trước chưa đạt acceptance criteria.

### Phase 0 — Khởi tạo repo
**Việc:** monorepo (mục 7.1); backend từ Initializr (Web MVC, Validation, JPA, PostgreSQL, Flyway, Security, OAuth2 Resource Server, Actuator, Cache, Modulith core/jpa/test, springdoc, Testcontainers); frontend từ `create-next-app` (TS, App Router, Tailwind, ESLint, pnpm); `docker-compose.yml`, Nginx, `.env.example`; CI khung; README ghi phiên bản đã ghim.
**Acceptance:** `docker compose up` chạy được; truy cập `/` thấy trang Next.js, `/api/actuator/health` (hoặc đường dẫn health đã định) trả `UP`; CI xanh.

### Phase 1 — Nền tảng (`shared`, `platform`)
**Việc:** `ErrorCode`/`BusinessException`/`GlobalExceptionHandler` (Problem Details + `traceId`); `Money`, `PageResponse`; `AuditingEntity`; cấu hình Jackson/OpenAPI/Cache/virtual threads; `SecurityFilterChain` khung (chưa có login); Flyway baseline; `ModularityTests` + `ArchitectureTests`; structured logging + Actuator/Prometheus.
**Acceptance:** `ModularityTests` xanh; endpoint mẫu trả lỗi đúng chuẩn RFC 9457; có test cho `GlobalExceptionHandler`.

### Phase 2 — `user` + `auth` + FE xác thực
**Việc (BE):** đăng ký, đăng nhập, `me`, refresh (xoay vòng + phát hiện tái sử dụng), logout; cookie httpOnly; RBAC cơ bản; rate-limit `/auth/*` ở Nginx; filter kiểm tra Origin.
**Việc (FE):** `features/auth`, trang login/register (Server Action + RHF + Zod), `proxy.ts` (redirect + refresh), layout vùng đã đăng nhập, server fetch forward cookie.
**Acceptance:** E2E login → vào trang bảo vệ → hết hạn access token vẫn tự refresh → logout; test bảo mật: sai mật khẩu, token giả, refresh bị tái sử dụng → bị thu hồi.

### Phase 3 — `product` + FE catalog
**Việc:** CRUD sản phẩm/danh mục (quản trị), API đọc công khai có phân trang/lọc, cache Caffeine có TTL + evict khi ghi; `ProductApi` (`reserveStock`, `getSummaries`); FE danh sách + chi tiết bằng RSC có cache tag.
**Acceptance:** truy vấn không N+1 (có test đếm query); cache hit/miss quan sát được qua metrics; trang catalog render server-side.

### Phase 4 — `order` + FE đặt hàng
**Việc:** luồng 4.4/4.5, `Idempotency-Key`, `OrderPlacedEvent`, `OrderPaidEvent`; FE giỏ hàng/checkout (Server Action), lịch sử đơn.
**Acceptance:** đặt cùng `Idempotency-Key` hai lần chỉ tạo một đơn; hết hàng → 409 đúng `code`; Modulith `Scenario` test cho event.

### Phase 5 — `payment`
**Việc:** `PaymentApi.initiate`, adapter VNPay (`payment/infrastructure`), endpoint IPN (xác minh chữ ký, **idempotent**), `PaymentSucceededEvent/FailedEvent`; timeout + retry + circuit breaker cho gọi ngoài.
**Acceptance:** IPN gửi lặp không đổi trạng thái thêm; chữ ký sai → từ chối; đơn chuyển `PAID` qua event; có test với cổng thanh toán giả.

### Phase 6 — `notification`
**Việc:** nghe `OrderPlaced/OrderPaid/PaymentFailed`, gửi email (Mailpit ở dev), lưu lịch sử gửi, retry khi lỗi (registry Modulith).
**Acceptance:** tắt SMTP → event không mất, gửi lại thành công sau khi bật; listener idempotent.

### Phase 7 — Hardening & tài liệu
**Việc:** rà soát bảo mật (OWASP ASVS cơ bản), load test mục tiêu (k6/Gatling) cho đặt hàng/catalog, tối ưu index, runbook (`docs/runbook.md`), cập nhật ADR, sơ đồ module sinh từ Modulith đính vào `docs/`.
**Acceptance:** không còn lỗi bảo mật mức cao; đạt SLO đề ra (vd. p95 < 300 ms cho đọc catalog ở tải mục tiêu); tài liệu vận hành đủ để người mới chạy được hệ thống.

---

## 10. Definition of Done & checklist chống anti-pattern

**Mỗi PR phải thoả:**
- [ ] `ModularityTests`, ArchUnit, test liên quan đều xanh; coverage domain/application không giảm.
- [ ] Không có Entity ở controller; không `ApiResponse<T>` bọc thành công; lỗi theo RFC 9457.
- [ ] Mỗi thay đổi schema có migration Flyway mới; không sửa migration cũ.
- [ ] Không import chéo module ngoài public API; không FK/JOIN xuyên schema.
- [ ] Thay đổi API → cập nhật OpenAPI snapshot + sinh lại client FE; CI contract xanh.
- [ ] Không có `any`, không có import sâu vào `features/*`; ESLint boundaries xanh.
- [ ] Không log dữ liệu nhạy cảm; không secret trong repo.
- [ ] Ghi ADR nếu thay đổi quyết định ở mục 1.

**Anti-pattern cần tránh:** package `util`/`common` phình to · service gọi repository của module khác · event chứa Entity · `@Transactional` bọc cuộc gọi HTTP ngoài · cache không TTL · thêm Kafka/K8s “cho đủ stack” · server state nhét vào Zustand · token trong `localStorage` · quyền chỉ kiểm tra ở FE · sửa file `schema.d.ts` bằng tay.

---

## Phụ lục A — Thay đổi so với Playbook gốc

| Chủ đề | Playbook gốc | Bản này | Lý do |
|---|---|---|---|
| Ranh giới module | Chỉ là tên package | Spring Modulith + `verify()` + luật phụ thuộc DAG | Không ép được thì sau 6 tháng lại thành “big ball of mud” |
| Cấu trúc trong module | `controller/service/repository/entity/dto/mapper` | `web / application / domain / infrastructure` + public API ở root | Thể hiện đúng Clean/DDD-lite, kiểm soát hướng phụ thuộc |
| `common` / `util` | Nhiều thư mục chung (mapper, validator, annotation…) | `shared` tối thiểu + `platform` | Tránh “bãi rác” |
| `infrastructure` cấp cao nhất | Gom redis/kafka/s3/email/payment | Adapter nằm trong module sở hữu; chỉ cái dùng chung lên `platform` | Tránh quay lại package-by-layer |
| API Gateway | Nginx gọi là gateway | Reverse proxy cùng origin | Monolith không cần gateway |
| Response | `{success, data, message}` | Resource trực tiếp + RFC 9457 cho lỗi | Dùng đúng HTTP status, dễ sinh client, dễ cache |
| Event | `ApplicationEventPublisher` hoặc `KafkaTemplate` | Modulith registry (outbox) → Kafka khi cần | Tránh mất/lệch event giữa DB và broker |
| Cache | Redis ngay từ đầu | Caffeine trước, Redis khi scale ngang | Giảm hạ tầng; TTL/evict là bắt buộc |
| Security | Tự viết `JwtFilter`/`UserDetailsService` | Resource Server + refresh rotation + cookie httpOnly + chống CSRF | Chuẩn hoá, giảm rủi ro |
| DB | “Một database” | Một DB, mỗi module một schema, Flyway, không FK xuyên module | Chuẩn bị đường tách service |
| Triển khai | Docker + Kubernetes | Docker Compose trước; K8s khi có nhu cầu | Phù hợp team 1–5 dev |
| Frontend | `services/hooks/stores/types/utils` ở top-level, `features/*/pages` | `app` (routing) + `features` + `shared`, ESLint ép ranh giới, RSC mặc định, client sinh từ OpenAPI | Hết lệch kiểu, đúng tư duy App Router |
| Thiếu hoàn toàn | — | Testing, CI/CD, observability, idempotency, migration, hợp đồng API, tiêu chí tách service | Bắt buộc để “xây được và vận hành được” |
