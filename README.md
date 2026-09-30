# algorithm-javascript

`algorithm_python` 저장소의 구조를 참고하여 TypeScript로 자료구조/알고리즘을 TDD로 구현하는 저장소입니다.

## 디렉토리 규칙

- `src/<category>/<name>.ts` — 구현 (현재는 시그니처만 갖춘 스텁이며, 본문은 `Not implemented` 에러를 던집니다)
- `tests/<category>/<name>.test.ts` — Vitest 테스트 코드 (algorithm_python의 `tests/<category>/test_<name>.py`를 이식)
- 디렉토리명은 원본 Python 저장소와 동일한 이름(snake_case)을 사용해 1:1로 대응시키고, 파일명은 TypeScript 관례에 따라 camelCase를 사용합니다.

## TDD 워크플로우

1. `pnpm install`
2. `pnpm run test:watch` 로 감시 모드 실행 (현재는 스텁이 `Not implemented`를 던지므로 RED 상태)
3. `src/<category>/<name>.ts`의 스텁을 실제 구현으로 채워서 테스트를 GREEN으로 만듭니다.
4. 필요하면 리팩터링 후에도 테스트가 계속 GREEN인지 확인합니다.

## 스크립트

- `pnpm test` — 전체 테스트 1회 실행
- `pnpm run test:watch` — 감시 모드
- `pnpm run test:coverage` — 커버리지 리포트 포함 실행
- `pnpm run typecheck` — 타입 검사만 실행 (빌드 없음)

## 패키지 매니저

이 저장소는 [pnpm](https://pnpm.io)을 사용합니다 (content-addressable store로 설치 속도와 디스크 효율이 npm 대비 우수). `packageManager` 필드가 `package.json`에 고정되어 있으므로 [Corepack](https://nodejs.org/api/corepack.html)을 활성화하면 (`corepack enable`) 버전이 자동으로 맞춰집니다.
