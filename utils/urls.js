const baseUrl = 'https://api.pingmm.cn/index.php/home/index/';
const baseSrc = 'https://api.pingmm.cn/static/';
const sqs = 'https://api.pingmm.cn/sqs.doc';
const upload = baseUrl + 'upload';
const getCity = baseUrl + 'getDetailByName';
const getIdp = baseUrl + 'getProvinces';
const getIdc = baseUrl + 'getCitys';
const getIdd = baseUrl + 'getDistrict';
const getReg = baseUrl + 'getRegionList';
const addvisit = baseUrl + 'addvisit';
const visit = baseUrl + 'visit';
const gloss = baseUrl + 'gloss';
const sendSms = baseUrl + 'jscode2session';
const userExist = baseUrl + 'userExist';
const register = baseUrl + 'register';
const code = baseUrl + 'sendSms';
const checkCode = baseUrl + 'checkCode';
const pay = baseUrl + 'payCall';
const robPay = baseUrl + 'robPay';
const vipCall = baseUrl + 'vipCall';
const bannerList = baseUrl + 'bannerList';
const createQcode = baseUrl + 'createQcode';
const decr = baseUrl + 'decree';
const myDeta = baseUrl + 'myDetail';
const modiUser = baseUrl + 'modiUser';
const comp = baseUrl + 'companyApprove';
const decrList = baseUrl + 'decreeList';
const tender = baseUrl + 'tenderList';
const decrDeta = baseUrl + 'decreeDetail';
const rob = baseUrl + 'rob';
const wall = baseUrl + 'myWallet';
const withdraw = baseUrl + 'withdraw';
const walle = baseUrl + 'walletDetail';
const myRob = baseUrl + 'myRobList';
const myDecr = baseUrl + 'myDecreeList';
const link = baseUrl + 'contractLink';
const checkDiscuss = baseUrl + 'checkDiscuss';
const signIn = baseUrl + 'signIn';
const fileList = baseUrl + 'fileList';
const exeList = baseUrl + 'exeList';
const mediaList = baseUrl + 'mediaList';
const folder = baseUrl + 'fileListByFolder';
const sclist = baseUrl + 'scoreComboList';
const scCall = baseUrl + 'scoreCall';
const myAddressList = baseUrl + 'myAddressList';
const addAddress = baseUrl + 'addAddress';
const modiAddress = baseUrl + 'modiAddress';
const addressDetail = baseUrl + 'addressDetail';
const reward = baseUrl + 'reward';
const discuss = baseUrl + 'discuss';
const share = baseUrl + 'shareProfit';
const comple = baseUrl + 'completeDecree';
const mySpec = baseUrl + 'specialList';
const compan = baseUrl + 'companyList';
const comCall = baseUrl + 'companyCall';
const freeLook = baseUrl + 'freeLook';
const spec = baseUrl + 'specialOrderList';
const specialListNew = baseUrl + 'specialListNew';
const dispatch = baseUrl + 'dispatch';
const specialDispatchList = baseUrl + 'specialDispatchList';
const mySpecialOrderList = baseUrl + 'mySpecialOrderList';
const feedback = baseUrl + 'feedback';
const checkFeedback = baseUrl + 'checkFeedback';
const reportSpecial = baseUrl + 'reportSpecial';
const report = baseUrl + 'report';
const sugg = baseUrl + 'suggestion';
const mySugg = baseUrl + 'mySuggestionList';
const version = baseUrl + 'version';
const pass = baseUrl + 'passwordExist';
const passw = baseUrl + 'passwordSet';
const passwo = baseUrl + 'passwordTrue';
const shop = baseUrl + 'shopList';
const exchange = baseUrl + 'exchange';
const score = baseUrl + 'scoreList';
const exlist = baseUrl + 'exchangeList';
const good = baseUrl + 'goodDetail';
const fileDeta = baseUrl + 'fileDetail';
const jBannerList = baseUrl + 'jBannerList';
const del = baseUrl + 'delAddress';
module.exports = {
  baseUrl,
  baseSrc,
  sqs,
  upload,
  getCity,
  getIdp,
  getIdc,
  getIdd,
  getReg,
  addvisit,
  visit,
  sendSms,
  userExist,
  register,
  code,
  checkCode,
  pay,
  robPay,
  decrList,
  tender,
  decr,
  myDeta,
  modiUser,
  comp,
  decrDeta,
  rob,
  myRob,
  myDecr,
  mySpec,
  compan,
  wall,
  walle,
  withdraw,
  sugg,
  mySugg,
  pass,
  passw,
  passwo,
  vipCall,
  reward,
  discuss,
  signIn,
  share,
  comple,
  shop,
  exchange,
  score,
  exlist,
  good,
  comCall,
  freeLook,
  spec,
  link,
  specialListNew,
  dispatch,
  specialDispatchList,
  mySpecialOrderList,
  gloss,
  bannerList,
  version,
  createQcode,
  checkDiscuss,
  feedback,
  checkFeedback,
  reportSpecial,
  report,
  myAddressList,
  addAddress,
  modiAddress,
  addressDetail,
  fileList,
  folder,
  fileDeta,
  sclist,
  scCall,
  del,
  jBannerList,
  exeList,
  mediaList
}