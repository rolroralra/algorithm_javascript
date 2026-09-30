# algorithm-javascript

`algorithm_python` 저장소의 구조를 참고하여 TypeScript로 자료구조/알고리즘을 TDD로 구현하는 저장소입니다.

## 디렉토리 규칙

- `src/<category>/<name>.ts` — 구현 (현재는 시그니처만 갖춘 스텁이며, 본문은 `Not implemented` 에러를 던집니다)
- `tests/<category>/<name>.test.ts` — Vitest 테스트 코드 (algorithm_python의 `tests/<category>/test_<name>.py`를 이식)
- 디렉토리명은 원본 Python 저장소와 동일한 이름(snake_case)을 사용해 1:1로 대응시키고, 파일명은 TypeScript 관례에 따라 camelCase를 사용합니다.

## TDD 워크플로우

1. `npm install`
2. `npm run test:watch` 로 감시 모드 실행 (현재는 스텁이 `Not implemented`를 던지므로 RED 상태)
3. `src/<category>/<name>.ts`의 스텁을 실제 구현으로 채워서 테스트를 GREEN으로 만듭니다.
4. 필요하면 리팩터링 후에도 테스트가 계속 GREEN인지 확인합니다.

## 스크립트

- `npm test` — 전체 테스트 1회 실행
- `npm run test:watch` — 감시 모드
- `npm run test:coverage` — 커버리지 리포트 포함 실행
- `npm run typecheck` — 타입 검사만 실행 (빌드 없음)
