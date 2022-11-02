# Token-Briefing

#### [확인 사항]

본 프로젝트는 요구된 사항에 맞추어 간단하게 제작되었습니다. 본 프로젝트는 폐쇄망에서 사용을 가정하여 개발되어 온라인에서 사용하기를 권장하지 않습니다. `본 프로젝트는 보안과 관련된 사항이 적용되어 있지 않습니다. (ssl 적용 불가 환경에서 사용을 목표로 가지고 있음)` 특정 조직의 그룹이 사용하는 것을 가정하여 개발되어 제3의 그룹이 함께 사용하는 것을 권장하지 않습니다.

### 프로젝트 내용

해당 프로젝트는 특정 기관의 그룹에서 내부적으로 간편하게 소통하는 것을 목적으로 개발되었습니다.

- 마감 번호의 정보를 가지고 있는 포스트를 1일 1개의 포스트를 게시
- 최근 n 건의 메모 포스트를 스택으로 표시 (n은 배포자의 설정에 따름)
- 내부망 PC에서 로그인과 같은 작업 없이 즉각적으로 게시글을 올릴 수 있도록 구성된 작성자 목록
- 클라이언트 다운로드 제공
- 클라이언트 업데이트 툴 다운로드 제공

해당 프로젝트에서는 http 프로토콜을 제공하며 알림 기능을 제공하지 않습니다. 알림 기능이 필요한 경우 아래의 프로젝트를 참고하세요.

https://github.com/Potato-Y/token-briefing-client

### 프로젝트 빌드

frontend 빌드

```bash
$ cd frontend
$ npm i
$ npm run build or wbuild
```

pc 환경에 따라 빌드 내용이 다릅니다. 윈도우를 사용하는 경우 `wbuild`를 사용합니다.

backend 빌드
빌드 전 `assets/client/win`에 다운로드에 필요한 파일이 배치되어 있는지 확인하세요.

```bash
$ cd backend
$ npm i
$ npm run build
```

윈도우 환경에서만 확인되었습니다. 빌드 된 바이너리 파일을 `C:\snapshot\backend` 폴더에 배치합니다.

### 빌드 한 바이너리를 부팅 시 자동으로 시작하기

`C:\snapshot\backend` 폴더에 두 개의 파일을 생성합니다.

`run.bat`

```bat
@echo off
echo 프로그램을 실행합니다.
echo.
start /d "C:\snapshot\backend" /b backend-win.exe
```

`run_backgroung.vbs`

```vbs
Set objShell = CreateObject("Shell.Application")
objShell.ShellExecute "c:\snapshot\backend\run.bat", "/c lodctr.exe /r", "", "runas", 0
```

`windows key + R` 을 통해 실행 창을 엽니다. `shell:startup`를 입력하여 시작 프로그램의 위치를 가진 파일 탐색기를 엽니다.
`run_backgroung.vbs` 파일을 이동합니다.
