<!-- CONSTITUTION SYNC IMPACT REPORT
-->

# av-psi Constitution

## Migration Mode

**Mode**: UPGRADE

**Justification**: This is a project of a website for Alejandra Valenzuela, a psychologist. The constitution codifies three non-negotiable architectural rules.

## Core Principles

### I. Clean Architecture & Layer Boundaries

Controllers, Services, and Domain logic MUST remain strictly isolated. HTTP exceptions (BadRequestException, NotFoundException, ForbiddenException, etc.) MUST be caught and handled exclusively in the Controller layer. Services and Domain layers MUST raise domain-specific exceptions or return Result types (Success/Failure patterns). Cross-layer exception leakage is a critical violation.

**Rationale**: Clean Architecture prevents tight coupling between transport concerns (HTTP) and business logic. Future transport layer changes (gRPC, message queues, etc.) require zero business logic modifications when boundaries are maintained.

### II. Strict TypeScript & Type Safety

No `any` type, ever. Strict compiler flags MUST remain enabled:

- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictBindCallApply: true`
- `forceConsistentCasingInFileNames: true`

All existing code violations MUST be remediated before merging to main. New pull requests MUST pass strict type checking without exceptions.

**Rationale**: Runtime type errors are the leading source of production incidents in Node.js applications. Strict TypeScript prevents entire categories of bugs at compile time.

### III. Infrastructure Service Isolation

All secrets and credentials MUST be retrieved exclusively via `SecretManagerService`. Direct `process.env` access is forbidden in business logic layers. All logging output MUST use `LoggerService`; `console.log()`, `console.error()`, etc. are forbidden in production code. Infrastructure dependencies (GCP Secret Manager, Cloud Logging, Firestore, Pub/Sub, Storage) MUST be injected as services, never instantiated directly.

**LoggerService Contract**: All logging MUST use the 4-parameter signature: `log(message: string | object, country: string | null, trx_trace_id: string | null, process_trace_id: string | null)`. The `trx_trace_id` parameter is the request correlation ID that MUST propagate from the HTTP controller through all service method calls to enable end-to-end request tracing in logs. The `country` parameter captures geographic or tenant context when applicable; use `null` for non-country-specific logs. The `process_trace_id` captures internal process-level tracing; use `null` when not applicable.

**Request ID Propagation Pattern**: Every HTTP request MUST generate a unique `trx_trace_id` at the controller entry point using `uuidv4()`. This ID MUST be passed as a parameter through all downstream service method calls. Controllers MUST NOT absorb service parameters into the signature; instead, service interfaces MUST explicitly accept `trx_trace_id` as a final parameter. This ensures service methods always have the request context needed for observability, and enables testing with predictable trace IDs.

**Rationale**: Centralized secret and logging management enables audit trails, enables rotation policies, and prevents credential leaks in stack traces. Request ID propagation enables complete transaction tracing across all layers, critical for debugging distributed failures. Service injection enables testing without external dependencies.

### IV. Naming & Structure Consistency

All modules MUST follow the established pattern: {feature}.module.ts, {feature}.controller.ts,
{feature}.service.ts, {feature}.interface.ts, dto/ for data transfer objects, impl/ for
implementations. Enum files MUST be grouped in enum/ directories. Shared utilities MUST be in
shared/ module. DTO classes MUST be suffixed with Dto (for example, CreateUserDto). DTO
validation and transformation MUST use decorators from class-validator and class-transformer.
Do not deviate from this structure; consistency enables new team members to navigate the
codebase immediately.

**DTO Type Safety**: Input DTOs (from file uploads, API requests) MUST use TypeScript's definite assignment assertion (`!`) on required properties to signal to the compiler that these properties are guaranteed to be present after validation by the global ValidationPipe. Output DTOs (responses) MUST be strongly typed with proper nullable indicators (`?` or `| null`) for optional fields. Example: `operationId!` for required input, `finishedAt?: Date` for optional output.

**External Type Handling**: When working with external types that lack complete type definitions (e.g., Multer.File), use unsafe casting with explicit type assertion: `(file as unknown as { originalname: string }).originalname`. This pattern isolates the type bridge in a single location, enabling quick updates if external library types improve.

**Rationale**: Predictable file organization and DTO standards reduce cognitive load, enforce a
consistent API contract boundary, and ensure reliable runtime validation and transformation. Type-safe DTO patterns catch errors at compile time and enable IDE autocomplete.

### V. Zero Lint Errors & Code Quality

ESLint and Prettier MUST pass on every commit. `npm run lint` and `npm run format` MUST produce zero errors or warnings. Code review MUST reject pull requests with lint failures. Test coverage targets: >80% on Services, >60% on Controllers.

**Rationale**: Automated code quality gates reduce review overhead and prevent drift in codebase aesthetics.

### VI. External Libraries & Integrations

Direct imports and usage of raw third-party clients (such as `axios`, `@google-cloud/firestore`, `pg`, `mysql`, `mssql`, etc.) are STRICTLY FORBIDDEN in service implementations. All external communication MUST route through existing internal connectors, adapters, or wrapper services already available within the monorepo. Before writing any code requiring external API calls, database queries, or cloud service access, you MUST analyze the monorepo to identify and reuse the appropriate internal connector.

**Port/Adapter Pattern Requirements**: Services MUST depend on interfaces (Ports) that are injected via Dependency Injection tokens. Adapters implementing these ports MUST encapsulate all external library usage. Each port MUST have a single responsibility (e.g., IDateSchedulePersistencePort, IDateScheduleApiClientPort, IDateScheduleJobStorePort). Adapters MUST be instantiated only in the module's provider configuration, never in service constructors. This pattern ensures:

- Services remain testable with mock adapters
- External library upgrades are isolated to adapter implementations
- Retry logic, error handling, and logging are applied consistently across all external calls
- Libraries can be swapped without changing business logic

**Error Handling Across Layers**: Services MUST raise domain-specific exceptions (e.g., DateScheduleRequestException for validation errors, DateScheduleProcessingException for infrastructure errors). Controllers MUST catch these exceptions and transform them into HTTP exceptions (BadRequestException for 400-level domain errors, InternalServerErrorException for 500-level infrastructure errors). Domain and service layers MUST NOT import HTTP exceptions from `@nestjs/common`; this ensures layers can be reused with other transports (gRPC, message queues, GraphQL, etc.) without modification.

**Rationale**: Centralizing external dependencies through internal adapters enables consistent error handling, retry policies, logging, and makes it possible to swap implementations (e.g., switch from Firestore to PostgreSQL) without changing business logic. It also prevents dependency sprawl and ensures audit/compliance requirements are met uniformly. Clean error handling boundaries prevent HTTP concerns from leaking into business logic.

## Development Standards

### Code Review Gates

- **Type Safety**: All PRs MUST pass `npm run build` with zero type errors
- **Linting**: All PRs MUST pass `npm run lint` with zero warnings
- **Testing**: All new services MUST include unit tests; integration tests required for cross-module communication
- **Architecture Review**: Changes to module structure, service contracts, or dependency injection MUST be reviewed by a senior architect

### Layer Validation Rules

- Services MUST NOT import HTTP exceptions from `@nestjs/common`
- Controllers MAY import HTTP exceptions; Services MUST NOT
- Domain entities MUST be independent of NestJS decorators
- DTOs MUST be co-located with their Controller or Service
- DTO class names MUST end with Dto
- DTO validation MUST use class-validator decorators
- DTO transformation MUST use class-transformer decorators

### Observability Requirements

- All service methods MUST log entry/exit points with method name and parameters
- All errors MUST be logged with stack trace and context
- Secrets MUST NOT appear in logs (sanitization required)
- Request/response bodies MUST NOT log PII without explicit approval

## Compliance & Linting

A `.eslintrc.json` configuration file MUST enforce:

- No `any` type usage
- No `console.*` calls in production code
- No HTTP exception imports in service layer (`/**/services/**` paths)
- Naming conventions: camelCase for variables/functions, PascalCase for classes/interfaces
- Import sorting and unused import removal

Continuous Integration MUST fail builds on lint errors. No exceptions, no overrides.

## Governance

**Amendment Procedure**:

1. Proposed change MUST be documented in a GitHub issue with clear rationale
2. Change MUST be reviewed by all team leads and the architect
3. Approval MUST be recorded in the issue comments
4. Constitution MUST be updated with new `LAST_AMENDED_DATE`
5. Version MUST be bumped according to semantic versioning (MAJOR for principle removals, MINOR for new principles, PATCH for clarifications)

**Versioning**:

- MAJOR bump: Breaking change to principles, removal of governance rules
- MINOR bump: New principle added, existing principle expanded, new constraint introduced
- PATCH bump: Clarifications, wording refinement, typo fixes

**Compliance Review**:

- Every quarter, a designated architect MUST audit the codebase against this constitution
- Non-compliance findings MUST be recorded and remediation tasks MUST be created in the project backlog
- Patterns of non-compliance on a principle MUST trigger discussion of whether the principle is viable or requires refinement

**Waiver Process**:
Exceptions to this constitution require explicit documented approval from the tech lead and architect. Waivers MUST include:

1. Clear business justification
2. Estimated remediation timeline
3. Acceptance of technical debt accrual

---

**Version**: 1.1.0 | **Ratified**: 2026-09-01 | **Last Amended**: 2026-09-01
