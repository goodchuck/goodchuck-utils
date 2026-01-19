# goodchuck-utils (Deprecated)

> ⚠️ **이 패키지는 더 이상 유지보수되지 않습니다.**

이 패키지는 [`@blastlabs/utils`](https://www.npmjs.com/package/@blastlabs/utils)로 이전되었습니다.

## 마이그레이션

기존 패키지를 제거하고 새 패키지를 설치해주세요:

```bash
# 기존 패키지 제거
npm uninstall goodchuck-utils

# 새 패키지 설치
npm install @blastlabs/utils
```

## 임포트 경로 변경

```diff
- import { useDebounce, useToggle } from 'goodchuck-utils/hooks';
+ import { useDebounce, useToggle } from '@blastlabs/utils/hooks';

- import { DevPanel, FormDevTools } from 'goodchuck-utils/components/dev';
+ import { DevPanel, FormDevTools } from '@blastlabs/utils/components/dev';
```

## 라이선스

ISC
