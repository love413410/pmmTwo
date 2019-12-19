const baseUrl = 'https://api.pingmm.cn/index.php/home/index/';
const baseSrc = 'https://api.pingmm.cn/static/';
const sqs = 'https://api.pingmm.cn/sqs.doc';
//图片上传接口
const upload = baseUrl + 'upload';
//地区的模糊查询
const getCity = baseUrl + 'getDetailByName';
//查询省接口
const getIdp = baseUrl + 'getProvinces';
//查询市接口
const getIdc = baseUrl + 'getCitys';
//查询县接口
const getIdd = baseUrl + 'getDistrict';
//根据字母选择城市
const getReg = baseUrl + 'getRegionList';
//添加最近访问 
const addvisit = baseUrl + 'addvisit';
const visit = baseUrl + 'visit';
const gloss = baseUrl + 'gloss';
//获取openid
const sendSms = baseUrl + 'jscode2session';
//判断是否已经注册
const userExist = baseUrl + 'userExist';
//注册接口
const register = baseUrl + 'register';
//验证码接口 
const code = baseUrl + 'sendSms';
//验证 验证码接口
const checkCode = baseUrl + 'checkCode';
//发布支付接口
const pay = baseUrl + 'payCall';
//抢单支付接口
const robPay = baseUrl + 'robPay';
const vipCall = baseUrl + 'vipCall';
const bannerList = baseUrl + 'bannerList';
const createQcode = baseUrl + 'createQcode';
//发布需求接口
const decr = baseUrl + 'decree';
//用户详情
const myDeta = baseUrl + 'myDetail';
//修改个人信息接口
const modiUser = baseUrl + 'modiUser';
// 企业认证接口
const comp = baseUrl + 'companyApprove';
// 需求大厅列表接口
const decrList = baseUrl + 'decreeList';
const tender = baseUrl + 'tenderList';

//需求详情接口
const decrDeta = baseUrl + 'decreeDetail';
// 抢单
const rob = baseUrl + 'rob';
//我的账户接口
const wall = baseUrl + 'myWallet';
//提现接口
const withdraw = baseUrl + 'withdraw';
const walle = baseUrl + 'walletDetail';
// 我的抢单
const myRob = baseUrl + 'myRobList';
// 我的发布
const myDecr = baseUrl + 'myDecreeList';
const link = baseUrl + 'contractLink';
const checkDiscuss = baseUrl + 'checkDiscuss';

const signIn = baseUrl + 'signIn';

const fileList = baseUrl + 'fileList';
const folder = baseUrl + 'fileListByFolder';

const sclist = baseUrl + 'scoreComboList';

const scCall = baseUrl + 'scoreCall';
// 物流地址
const myAddressList = baseUrl + 'myAddressList';
const addAddress = baseUrl + 'addAddress';
const modiAddress = baseUrl + 'modiAddress';

const addressDetail = baseUrl + 'addressDetail';

//打赏接口
const reward = baseUrl + 'reward';
const discuss = baseUrl + 'discuss';
const share = baseUrl + 'shareProfit';
const comple = baseUrl + 'completeDecree';
//厂家技术查询/派单人员列表/卡莱特名录列表接口
const mySpec = baseUrl + 'specialList';
//服务商企业名录
const compan = baseUrl + 'companyList';
const comCall = baseUrl + 'companyCall';
const freeLook = baseUrl + 'freeLook';
// 卡莱特接口
const spec = baseUrl + 'specialOrderList';
const specialListNew = baseUrl + 'specialListNew';
const dispatch = baseUrl + 'dispatch';
const specialDispatchList = baseUrl + 'specialDispatchList';
const mySpecialOrderList = baseUrl + 'mySpecialOrderList';
const feedback = baseUrl + 'feedback';
const checkFeedback = baseUrl + 'checkFeedback';
const reportSpecial = baseUrl + 'reportSpecial';
const report = baseUrl + 'report';
//意见反馈
const sugg = baseUrl + 'suggestion';
const mySugg = baseUrl + 'mySuggestionList';
const version = baseUrl + 'version';
//支付密码判断以及设置
const pass = baseUrl + 'passwordExist';
const passw = baseUrl + 'passwordSet';
const passwo = baseUrl + 'passwordTrue';
//积分商城
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
  jBannerList
}