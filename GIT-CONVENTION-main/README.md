# GIT 커밋 메세지 작성 규칙



| Emoji | Description | 
|------|---|
| 🎨 | 코드의 형식 / 구조를 개선 할 때 |
| 📰 | 새 파일을 만들 때 |
| 📝 | 사소한 코드 또는 언어를 변경할 때 |
| 🐎 | 성능을 향상시킬 때 |
| 📚 | 문서를 쓸 때 |
| 🐛 | 버그 reporting할 때, @FIXME 주석 태그 삽입 |
| 🚑 | 버그를 고칠 때 |
| 🐧 | 리눅스에서 무언가를 고칠 때 |
| 🍎 | Mac OS에서 무언가를 고칠 때 |
| 🏁 | Windows에서 무언가를 고칠 때 |
| 🔥 | 코드 또는 파일 제거할 때 , @CHANGED주석 태그와 함께 |
| 🚜 | 파일 구조를 변경할 때 . 🎨과 함께 사용 |
| 🔨 | 코드를 리팩토링 할 때 |
| ☔️ | 테스트를 추가 할 때 |
| 🔬 | 코드 범위를 추가 할 때 |
| 💚 | CI 빌드를 고칠 때 |
| 🔒 | 보안을 다룰 때 |
| ⬆️ | 종속성을 업그레이드 할 때 |
| ⬇️ | 종속성을 다운 그레이드 할 때 |
| ⏩ | 이전 버전 / 지점에서 기능을 전달할 때 |
| ⏪ | 최신 버전 / 지점에서 기능을 백 포트 할 때 |
| 👕 | linter / strict / deprecation 경고를 제거 할 때 |
| 💄 | UI / style 개선시 |
| ♿️ | 접근성을 향상시킬 때 |
| 🚧 | WIP (진행중인 작업)에 커밋, @REVIEW주석 태그와 함께 사용 |
| 💎 | New Release |
| 🔖 | 버전 태그 |
| 🎉 | Initial Commit |
| 🔈 | 로깅을 추가 할 때 |
| 🔇 | 로깅을 줄일 때 |
| ✨ | 새로운 기능을 소개 할 때 |
| ⚡️ | 도입 할 때 이전 버전과 호환되지 않는 특징, @CHANGED주석 태그 사용 |
| 💡 | 새로운 아이디어, @IDEA주석 태그 |
| 🚀 | 배포 / 개발 작업 과 관련된 모든 것
| 🐘 | PostgreSQL 데이터베이스 별 (마이그레이션, 스크립트, 확장 등) |
| 🐬 | MySQL 데이터베이스 특정 (마이그레이션, 스크립트, 확장 등) |
| 🍃 | MongoDB 데이터베이스 특정 (마이그레이션, 스크립트, 확장 등) |
| 🏦 | 일반 데이터베이스 별 (마이그레이션, 스크립트, 확장명 등) |
| 🐳 | 도커 구성 |
| 🤝 | 파일을 병합 할 때 |
| ⚙️ | 설정 파일을 변경할 때 |

| 태그이름 | 설명 | 
|------|---|
| Feat | 새로운 기능을 추가할 경우 |
| Fix | 버그를 고친 경우 |
| Add | 파일 등을 추가할 경우 |
| Design | CSS 등 사용자 UI 디자인 변경 |
| !BREAKING CHANGE | 커다란 API 변경의 경우 |
| !HOTFIX | 급하게 치명적인 버그를 고쳐야하는 경우 |
| Style | 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우 |
| Refactor | 프로덕션 코드 리팩토링 |
| Comment | 필요한 주석 추가 및 변경 |
| Docs | 문서를 수정한 경우 |
| Test | 테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X) |
| Chore | 빌드 태스트 업데이트, 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X) |
| Rename | 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우 |
| Remove | 파일을 삭제하는 작업만 수행한 경우 |
| Init | 프로젝트 생성 후 첫 커밋 |
| Release | 버전 릴리즈 커밋 |

![image](https://github.com/AIVLE-ENTER/GIT-CONVENTION/assets/95211722/bdcd58a1-4d08-4ad3-85f8-b657cf5bf175)

[형태] <br/>
Type: Imoji Subject <br/>
Body <br/>
Footer <br/>
- 전부 영어로 작성할 것
- 제목은 50자를 넘기지 않을 것
- 본문은 한줄에 72자를 넘기지 않을 것
- 본문과 푸터는 선택사항 (안써도 됨!!)

<a target="_blank" href="https://velog.io/@shin6403/Git-git-%EC%BB%A4%EB%B0%8B-%EC%BB%A8%EB%B2%A4%EC%85%98-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0">이거 꼭 읽으세요!!</a><br/>
<a target="_blank" href="https://junhyunny.github.io/information/github/git-commit-message-rule/">자세한 설명 보러가기</a>