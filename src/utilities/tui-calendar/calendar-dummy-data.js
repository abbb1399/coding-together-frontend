export default [
  {
    id: '1',
    calendarId: 'major',
    title: '자료구조론',
    category: 'time',              // 일반 일정
    start: '2022-02-18T10:00:00',
    end: '2022-02-18T11:00:00'
  },
  {
    id: '2',
    calendarId: 'sub',
    title: '웹 프로그래밍',
    category: 'time',
    start: '2022-02-18T14:00:00',
    end: '2022-02-18T15:00:00'
  },
  {
    id: '3',
    calendarId: 'etc',
    title: '영양과 건강',
    category: 'time',
    start: '2022-02-18T13:00:00',
    end: '2022-02-18T14:00:00'
  },
  {
    id: '3',
    calendarId: 'sub',
    title: '인공지능',
    category: 'time',
    start: '2022-02-16T09:00:00',
    end: '2022-02-16T10:00:00'
  },
  {
    id: '4',
    calendarId: 'major',
    title: '소프트웨어 공학',
    category: 'time',
    dueDateClass: '',
    start: '2022-02-17T09:00:00',
    end: '2022-02-17T10:30:00'
  },
  {
    id: '5',
    calendarId: 'sub',
    title: '데이터베이스',
    category: 'time',
    start: '2022-02-17T10:30:00',
    end: '2022-02-17T12:00:00'
  },
  {
    id: '6',
    calendarId: 'major',
    title: '알고리즘',
    category: 'time',
    dueDateClass: '',
    start: '2022-02-19T13:00:00',
    end: '2022-02-19T14:30:00'
  },
  {
    id: '8',
    calendarId: 'major',
    title: '강촌 OT',
    category: 'allday',              // 종일 일정
    start: '2022-02-20',
    end: '2022-02-21',
    state:'busy',
    // color: '#ffffff',
    // bgColor: '#ff4040',              // 일정 색상을 직접 지정할 수 있어요
    // dragBgColor: '#ff4040',
    // borderColor: '#ff4040'
  },
  {
    id: '9',
    calendarId: 'Homework',
    title: '소프트웨어 개론 레포트 제출',
    category: 'task',                 // 태스크
    start: '2022-02-19T10:30:00',
    end: '2022-02-19T11:30:00',
    color: '#ffffff',
    bgColor: '#9e5fff',
    dragBgColor: '#9e5fff',
    borderColor: '#9e5fff'
  },
  {
    id: '10',
    calendarId: 'Test',
    title: '쪽지 시험',
    category: 'milestone',              // 마일스톤
    start: '2022-02-20T11:30:00',
    end: '2022-02-20T12:00:00',
    color: '#bbdc00',
    bgColor: '#ffffff',
    dragBgColor: '#ffffff',
    borderColor: '#ffffff'
  }
]