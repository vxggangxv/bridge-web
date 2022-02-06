import { icon_extension_doc } from 'components/base/images';
import { color } from 'styles/utils';
// fileExtensionList

export const brand = {
  logo: {
    index: 'logo',
    text: 'DOF Bridge',
  },
};

export const setting = {
  language: {
    kr: {
      id: 1,
      label: 'Korean',
      index: 'KR',
    },
    en: {
      id: 2,
      label: 'English',
      index: 'EN',
    },
  },
};

export const pageUrl = {
  index: '/',
  home: '/home',
  auth: {
    index: '/auth',
    signIn: '/auth/login',
    signUp: '/auth/join',
    signOut: '/auth/logout',
    resetPassword: '/auth/reset-password',
    findId: '/auth/find-id',
  },
  error: {
    index: '/error',
    server: '/error/500',
    notFound: '/error/404',
  },
  // 예외
  project: {
    index: '/project',
    list: '/project/list',
    detail: '/project/detail/:pcode',
    create: '/project/create',
    edit: '/project/edit/:pcode',
  },
  designer: {
    index: '/designers',
    detail: '/designers/@:uid',
    portfolio: '/designers/@:uid/portfolio',
    project: '/designers/@:uid/projects',
  },
  user: {
    index: '/@:uid',
    profile: '/@:uid/profile',
    changePassword: '/@:uid/profile/password',
    profileEdit: '/@:uid/profile/edit',
    portfolio: '/@:uid/portfolio',
    // editProfile: '/@:uid/profile/edit',
    project: '/@:uid/projects',
    projectByClient: '/@:uid/projects/made-project',
    projectByDesigner: '/@:uid/projects/applied-project',
    notifications: '/@:uid/notifications',
    exchange: '/@:uid/order/exchange',
    history: '/@:uid/order/point-history',
    // store: '/@:uid/order/store',
    orderDetail: '/@:uid/order/point-history/detail/:oid',
    invoice: '/@:uid/order/invoice',
    qna: '/@:uid/qnas',
    qnaDetail: '/@:uid/qnas/detail/:bid',
    qnaEdit: '/@:uid/qnas/edit/:bid',
    qnaCreate: '/@:uid/qnas/create',
  },
  order: {
    index: '/order',
    // store: '/order/store',
    exchange: '/order/exchange',
    invoice: '/order/invoice',
  },
  store: {
    // index: '/@:uid/store',
    index: '/store',
    detail: '/store/detail/:oid',
  },
  payment: {
    index: '/payment',
    success: '/payment/payletter/return/success',
    cancel: '/payment/payletter/return/cancel',
    cashreceipt: '/payment/payletter/return/cashreceipt',
    virtualaccount: '/payment/payletter/return/virtualaccount',
    paymentTestPopupUrl: '/payment/payletter/return/paymentTestPopupUrl',
  },
  legal: {
    index: '/legal',
    termsOfService: '/legal/terms',
    privacyPolicy: '/legal/privacy',
  },
  howto: {
    index: '/howto',
  },
};

export const navigation = [
  // TODO: 릴리즈 시 홈 삭제
  // {
  //   path: pageUrl.home,
  //   text: 'Home',
  //   index: 0,
  // },
  {
    path: pageUrl.howto.index,
    text: 'How to',
    index: 0,
  },
  {
    path: pageUrl.project.create,
    text: 'Make a project',
    index: 1,
  },
  {
    path: pageUrl.project.list,
    text: 'Find a project',
    index: 2,
  },
  // {
  //   path: pageUrl.designer.index,
  //   text: 'Designers',
  //   index: 3,
  // },
  {
    path: pageUrl.store.index,
    text: 'Store',
    index: 4,
  },
];

export const visibilityType = {
  public: {
    id: 0,
    label: 'Public',
    index: 'public',
  },
  partnerShip: {
    id: 1,
    label: 'Public to Partners',
    index: 'partnerShip',
  },
};

export const companyType = {
  clinic: {
    id: 1,
    label: 'Clinic',
    index: 'clinic',
  },
  lab: {
    id: 2,
    label: 'CAD Lab',
    index: 'lab',
  },
  milling: {
    id: 3,
    label: 'Milling Center',
    index: 'milling',
  },
  designer: {
    id: 4,
    label: 'Designer',
    index: 'designer',
  },
};

export const toolList = [
  { id: 1, label: 'exocad' },
  { id: 2, label: '3Shape' },
  // { id: 3, label: 'Cerec' },
  // { id: 4, label: 'Dental Wing' },
];

export const stageList = [
  // { id: 0, label: 'create' },
  { id: 0, label: 'waiting' },
  { id: 1, label: 'matching' },
  { id: 2, label: 'working' },
  { id: 3, label: 'done' },
  { id: 4, label: 'complete' },
];

// country id : 116 - Korea South(KR), 109 - Japan(JP), 233 - United States(US)
export const requiredCountryListForLab = [116, 109];

export const projectOrderList = [
  // { id: 0, label: 'Latest' },
  // { id: 1, label: 'Rate' },
  // { id: 2, label: 'Name (DESC)' },
  // { id: 3, label: 'Name (ASC)' },
  { id: 0, label: 'LATEST' },
  { id: 1, label: 'RATE' },
  // { id: 2, label: 'NAME_DESC' },
  { id: 3, label: 'NAME_ASC' },
];

export const project = {
  parameterModel: {
    scan: 'separateGingivaScan',
    gingiva: 'separateGingivaScan',
  },
  processDeletePossibleList: [0, 3],
  // name: 보여지는 label 개념, nameValue: 실제 오는 매칭 값
  processFlagList: [
    {
      name: 'create',
      nameValue: 'waiting',
      id: 0,
      title: 'Waiting',
      color: color.stage_waiting,
    },
    {
      // TODO: review
      name: 'matching',
      nameValue: 'matching',
      id: 1,
      title: 'Matching',
      color: color.stage_matching,
    },
    {
      name: 'working',
      nameValue: 'working',
      id: 2,
      title: 'Working',
      color: color.stage_working,
    },
    {
      name: 'done',
      nameValue: 'done',
      id: 3,
      title: 'Done',
      color: color.stage_done,
    },
    {
      name: 'complete',
      nameValue: 'complete',
      id: 4,
      title: 'Complete',
      color: color.stage_complete,
    },
  ],
};

export const projectProcessFlagList = [
  {
    index: 0,
    name: 'create',
    nameValue: 'waiting',
    stage: [0],
    title: 'Waiting',
    color: color.stage_waiting,
  },
  {
    index: 1,
    name: 'review',
    nameValue: 'review',
    stage: [1],
    title: 'Review',
    color: color.stage_matching,
  },
  {
    index: 2,
    name: 'design',
    nameValue: 'design',
    stage: [2, 3],
    title: 'Design',
    color: color.stage_design,
  },
  {
    index: 3,
    name: 'complete',
    nameValue: 'complete',
    stage: [4],
    title: 'Complete',
    color: color.stage_complete,
  },
];

// socket projectEvent에 따른 분기
export const projectEventType = {
  designerEnter: 'DESIGNER_ENTER',
  designerLeave: 'DESIGNER_LEAVE',
  userEnter: 'USER_ENTER',
  userLeave: 'USER_LEAVE',
  projectUpdate: 'PROJECT_UPDATE',
  applyDesigner: 'APPLY_DESIGNER',
  fileUpload: 'FILE_UPLOAD',
  fileDownload: 'FILE_DOWNLOAD',
  fileDelete: 'FILE_DELETE',
};

// projectStatus에 따른 분기
export const projectEmptyMatchingStatus = {
  giveUp: 'GIVEUP', // designer가 giveup
  change: 'CHANGE', // client가 designer change
  reject: 'REJECT', // designer가 select받은 후 reject
  renew: 'RENEW', // project가 renew
  expired: 'EXPIRED', // select 된 디자이너 모두 expired
};

export const fileExtensionList = [
  'doc',
  'docx',
  'jpg',
  'mp3',
  'mp4',
  'pdf',
  'png',
  'ppt',
  'pptx',
  'rar',
  'stl',
  'txt',
  'xls',
  'xlsx',
  'zip',
];

// Notification page
export const notificationsEventTypeList = [
  // { eventType: 'PROJECT_CREATE', eventTitle: '프로젝트 생성' },
  // { eventType: 'PROJECT_UPDATE', eventTitle: '프로젝트 업데이트' },
  // { eventType: 'PROJECT_REVIEW', eventTitle: '프로젝트 리뷰 시작' },
  { eventType: 'PROJECT_REVIEW_COMPLETE', eventTitle: '프로젝트 리뷰 완료' },
  // { eventType: 'DESIGNER_WORKING', eventTitle: '디자이너 작업 시작' },
  { eventType: 'DESIGNER_WORK_DONE', eventTitle: '디자이너 작업 완료' },
  { eventType: 'CLIENT_CONFIRM', eventTitle: '클라이언트 컨펌앤페이' },
  { eventType: 'CLIENT_REMAKE_REQ', eventTitle: '클라이언트 리메이크 요청' },
];

export const currencyList = [
  {
    type: 'KRW',
    symbol: '&#8361;',
  },
  {
    type: 'USD',
    symbol: '&#36;',
  },
];
// export const fileExtensionList = [
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'docx',
//     src: icon_extension_docx
//   },
//   {
//     type: 'jpg',
//     src: icon_extension_jpg
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
//   {
//     type: 'doc',
//     src: icon_extension_doc
//   },
// ]
export const notificationsModalEventType = {
  client: 'clientByProject',
  designer: 'designerByProject',
};
