# goodchuck-utils

React 프로젝트에서 자주 사용하는 유틸리티 훅(Hooks)과 개발용 컴포넌트 모음입니다.

## 설치

```bash
npm install goodchuck-utils
# or
yarn add goodchuck-utils
# or
pnpm add goodchuck-utils
```

## 기능

### 📦 Hooks

프로젝트에서 자주 사용하는 커스텀 훅들을 제공합니다.

```typescript
import { useDebounce, useToggle, useCopyToClipboard } from 'goodchuck-utils/hooks';
```

#### 사용 가능한 Hooks

- **useDebounce** - 값의 변경을 지연시켜 성능 최적화
- **useThrottle** - 함수 실행 빈도를 제한하여 성능 최적화
- **useToggle** - boolean 상태를 쉽게 토글
- **useCopyToClipboard** - 클립보드 복사 기능
- **useWindowSize** - 윈도우 크기 추적
- **usePrevious** - 이전 값 추적
- **useIntersectionObserver** - Intersection Observer API 활용
- **useEventListener** - 이벤트 리스너 관리

### 🛠️ Development Components

개발 환경에서만 사용하는 유틸리티 컴포넌트들입니다.

```typescript
import { DevPanel, FormDevTools, ApiLogger } from 'goodchuck-utils/components/dev';
```

#### IdSelector

개발 환경에서 여러 계정으로 빠르게 로그인할 수 있는 컴포넌트입니다.

```tsx
import { IdSelector } from 'goodchuck-utils/components/dev';

const devAccounts = [
  { id: 'admin', pw: 'admin123', memo: '관리자' },
  { id: 'user1', pw: 'user123', memo: '일반 사용자' },
];

function App() {
  const handleLogin = async (id: string, pw: string) => {
    // 로그인 로직
    await loginApi(id, pw);
  };

  return (
    <div>
      {import.meta.env.DEV && (
        <IdSelector onLogin={handleLogin} infos={devAccounts} />
      )}
    </div>
  );
}
```

#### FormDevTools

react-hook-form의 상태를 실시간으로 시각화하는 개발용 컴포넌트입니다.

```tsx
import { useForm } from 'react-hook-form';
import { FormDevTools } from 'goodchuck-utils/components/dev';

function MyForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      age: 0,
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('username')} />
      <input {...form.register('email')} />
      <button type="submit">Submit</button>

      {import.meta.env.DEV && <FormDevTools form={form} />}
    </form>
  );
}
```

**주요 기능:**
- 폼 값(values) 실시간 확인
- 에러(errors) 상태 확인
- 변경된 필드(dirtyFields) 추적
- 터치된 필드(touchedFields) 확인
- Mock 데이터 생성 기능
- 드래그 & 리사이즈 가능한 패널

#### ApiLogger

API 요청/응답을 로깅하고 모니터링하는 컴포넌트입니다.

```tsx
import axios from 'axios';
import { ApiLogger, addApiLog } from 'goodchuck-utils/components/dev';

// Axios interceptor 설정
axios.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata?.startTime;

    addApiLog({
      method: response.config.method?.toUpperCase() || 'GET',
      url: response.config.url || '',
      status: response.status,
      statusText: response.statusText,
      duration,
      requestBody: response.config.data,
      responseBody: response.data,
    });

    return response;
  },
  (error) => {
    const duration = Date.now() - error.config?.metadata?.startTime;

    addApiLog({
      method: error.config?.method?.toUpperCase() || 'GET',
      url: error.config?.url || '',
      status: error.response?.status,
      statusText: error.response?.statusText,
      duration,
      requestBody: error.config?.data,
      responseBody: error.response?.data,
      error: error.message,
    });

    return Promise.reject(error);
  }
);

function App() {
  return (
    <div>
      {import.meta.env.DEV && <ApiLogger />}
    </div>
  );
}
```

**주요 기능:**
- API 요청/응답 로그 수집
- 요청 메서드, URL, 상태 코드 표시
- 응답 시간(duration) 측정
- Request/Response Body 확인
- 로그 복사 및 삭제 기능

#### DevPanel

여러 개발 도구를 하나의 패널에서 관리할 수 있는 통합 컴포넌트입니다.

```tsx
import { DevPanel } from 'goodchuck-utils/components/dev';

function App() {
  return (
    <div>
      {import.meta.env.DEV && <DevPanel />}
    </div>
  );
}
```

**주요 기능:**
- 윈도우 크기 표시
- 렌더 카운트 표시
- LocalStorage 삭제
- SessionStorage 삭제

#### ZIndexDebugger

페이지의 모든 z-index 값을 시각화하고 디버깅하는 도구입니다.

```tsx
import { ZIndexDebugger } from 'goodchuck-utils/components/dev';

function App() {
  return (
    <div>
      {import.meta.env.DEV && <ZIndexDebugger />}
    </div>
  );
}
```

**주요 기능:**
- 모든 요소의 z-index 값 스캔
- 요소에 마우스 오버 시 하이라이트
- 클릭 시 해당 요소로 스크롤
- z-index 값 정렬 (높은 순/낮은 순)

#### WindowSizeDisplay

현재 윈도우 크기를 화면에 표시하는 간단한 컴포넌트입니다.

```tsx
import { WindowSizeDisplay } from 'goodchuck-utils/components/dev';

function App() {
  return (
    <div>
      {import.meta.env.DEV && <WindowSizeDisplay />}
    </div>
  );
}
```

## 개발 환경 구분

### Vite 프로젝트
```tsx
{import.meta.env.DEV && <DevPanel />}
```

### Create React App 프로젝트
```tsx
{process.env.NODE_ENV === 'development' && <DevPanel />}
```

## TypeScript 지원

모든 컴포넌트와 훅은 TypeScript로 작성되었으며, 타입 정의가 포함되어 있습니다.

```typescript
import type { FormDevToolsProps, ApiLogEntry } from 'goodchuck-utils/components/dev';
```

## 주의사항

- **개발용 컴포넌트(`components/dev`)는 프로덕션 환경에서 제외하는 것을 권장합니다.**
- 개발 환경 구분을 위해 `import.meta.env.DEV` (Vite) 또는 `process.env.NODE_ENV === 'development'` (CRA)를 사용하세요.

## 라이선스

ISC

## 기여

이슈나 PR은 언제든 환영합니다!
