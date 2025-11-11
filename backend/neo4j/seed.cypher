// Neo4j seed data derived from 《知识图谱数据结构.md》
// 使用方法：
//   cypher-shell -u neo4j -p password -f seed.cypher

// ---------- Constraints ----------
CREATE CONSTRAINT fraudster_code IF NOT EXISTS
FOR (f:Fraudster) REQUIRE f.code IS UNIQUE;

CREATE CONSTRAINT victim_code IF NOT EXISTS
FOR (v:Victim) REQUIRE v.code IS UNIQUE;

CREATE CONSTRAINT case_code IF NOT EXISTS
FOR (c:Case) REQUIRE c.code IS UNIQUE;

CREATE CONSTRAINT account_code IF NOT EXISTS
FOR (a:Account) REQUIRE a.code IS UNIQUE;

CREATE CONSTRAINT org_code IF NOT EXISTS
FOR (o:Organization) REQUIRE o.code IS UNIQUE;

CREATE CONSTRAINT channel_code IF NOT EXISTS
FOR (c:Channel) REQUIRE c.code IS UNIQUE;

CREATE CONSTRAINT scamtype_code IF NOT EXISTS
FOR (s:ScamType) REQUIRE s.code IS UNIQUE;

CREATE CONSTRAINT trigger_code IF NOT EXISTS
FOR (t:PsychologicalTrigger) REQUIRE t.code IS UNIQUE;

CREATE CONSTRAINT device_code IF NOT EXISTS
FOR (d:Device) REQUIRE d.code IS UNIQUE;

CREATE CONSTRAINT txn_code IF NOT EXISTS
FOR (t:Transaction) REQUIRE t.tx_id IS UNIQUE;

// ---------- Reference nodes ----------
MERGE (invest:ScamType {code:'SCAM_INVEST', name:'网络投资理财诈骗'})
  SET invest.category='投资骗局',
      invest.risk_level='high',
      invest.description='以内幕交易、虚假券商为噱头，诱导进行大额转账';

MERGE (law:ScamType {code:'SCAM_LAW', name:'公检法冒充诈骗'})
  SET law.category='通讯网络诈骗',
      law.risk_level='high',
      law.description='冒充公检法/银行客服，制造紧急威胁逼迫汇款';

MERGE (romance:ScamType {code:'SCAM_ROMANCE', name:'情感陪聊（杀猪盘）'})
  SET romance.category='社交关系诈骗',
      romance.risk_level='high',
      romance.description='长期养号建立情感信任后引导投资或借贷';

MERGE (trigger_high:PsychologicalTrigger {code:'TR_HIGH_RETURN', name:'高收益承诺'})
  SET trigger_high.description='以短期高收益或内幕消息吸引受害者';

MERGE (trigger_fear:PsychologicalTrigger {code:'TR_FEAR', name:'紧急威胁'})
  SET trigger_fear.description='通过法律/安全威胁制造恐慌与从众心理';

MERGE (trigger_emotion:PsychologicalTrigger {code:'TR_EMOTION', name:'情感依赖'})
  SET trigger_emotion.description='长期聊天培养信任后发起经济诉求';

MERGE (channel_wechat:Channel {code:'CH_SOCIAL_WECHAT'})
  SET channel_wechat.name='社交平台私聊',
      channel_wechat.platform='WeChat',
      channel_wechat.category='SOCIAL',
      channel_wechat.description='微信群/私聊引流';

MERGE (channel_phone:Channel {code:'CH_PHONE_IMPERSONATION'})
  SET channel_phone.name='电话冒充专线',
      channel_phone.platform='VoIP拨号',
      channel_phone.category='CALL_CENTER',
      channel_phone.description='搭建境外呼叫中心，使用改号软件';

MERGE (channel_app:Channel {code:'CH_DATING_APP'})
  SET channel_app.name='婚恋社交 App',
      channel_app.platform='LoveLink',
      channel_app.category='APP',
      channel_app.description='海外婚恋社交应用导流';

MERGE (org_shell:Organization {code:'ORG-OCEAN-LLC'})
  SET org_shell.name='蓝海咨询有限公司',
      org_shell.type='空壳公司',
      org_shell.region='香港',
      org_shell.risk_level='high';

MERGE (org_exchange:Organization {code:'ORG-EXCHANGE-01'})
  SET org_exchange.name='星盾数字资产所',
      org_exchange.type='伪装交易所',
      org_exchange.region='柬埔寨',
      org_exchange.risk_level='high';

MERGE (org_wallet:Organization {code:'ORG-WALLET-01'})
  SET org_wallet.name='SafeWallet',
      org_wallet.type='第三方钱包',
      org_wallet.region='新加坡',
      org_wallet.risk_level='medium';

MERGE (device_android:Device {code:'DEV-ANDROID-01'})
  SET device_android.type='Android手机',
      device_android.brand='OPPO Reno',
      device_android.location='菲律宾马尼拉';

MERGE (device_dialer:Device {code:'DEV-DIALER-01'})
  SET device_dialer.type='VoIP网关',
      device_dialer.brand='Hytera',
      device_dialer.location='金边';

MERGE (device_mac:Device {code:'DEV-MAC-01'})
  SET device_mac.type='MacBook Pro',
      device_mac.location='迪拜',
      device_mac.usage='远程操盘';

// ---------- Case 1: 投资理财诈骗 ----------
MERGE (fraud_lin:Fraudster {code:'FRAUD-LIN', name:'林灿', alias:'港股导师'})
  SET fraud_lin.location='菲律宾马尼拉',
      fraud_lin.role='项目负责人',
      fraud_lin.risk_level='high';

MERGE (victim_chen:Victim {code:'VICTIM-CHEN'})
  SET victim_chen.name='陈女士',
      victim_chen.city='上海',
      victim_chen.age=42,
      victim_chen.occupation='外企财务',
      victim_chen.loss_amount=320000;

MERGE (case_invest:Case {code:'CASE-INVEST-2024-001'})
  SET case_invest.title='港股内线投资骗局',
      case_invest.status='open',
      case_invest.loss_amount=320000,
      case_invest.start_date=date('2024-08-03'),
      case_invest.level='一级预警';

MERGE (account_hk:Account {code:'ACC-HK-8890'})
  SET account_hk.bank='Bank of Asia',
      account_hk.country='香港',
      account_hk.type='shell_company',
      account_hk.risk_level='high';

MERGE (txn_inv1:Transaction {tx_id:'TX-INV-001'})
  SET txn_inv1.amount=200000,
      txn_inv1.currency='CNY',
      txn_inv1.method='bank_transfer',
      txn_inv1.tx_date=date('2024-09-12');

MERGE (txn_inv2:Transaction {tx_id:'TX-INV-002'})
  SET txn_inv2.amount=120000,
      txn_inv2.currency='CNY',
      txn_inv2.method='bank_transfer',
      txn_inv2.tx_date=date('2024-09-14');

MERGE (fraud_lin)-[:USES_DEVICE]->(device_android);
MERGE (fraud_lin)-[:RUNS_CASE]->(case_invest);
MERGE (case_invest)-[:BELONGS_TO]->(invest);
MERGE (invest)-[:EXPLOITS]->(trigger_high);
MERGE (case_invest)-[:USES_CHANNEL]->(channel_wechat);
MERGE (case_invest)-[:TARGETS]->(victim_chen);
MERGE (case_invest)-[:HAS_TRANSACTION]->(txn_inv1);
MERGE (case_invest)-[:HAS_TRANSACTION]->(txn_inv2);
MERGE (victim_chen)-[:INITIATED]->(txn_inv1);
MERGE (victim_chen)-[:INITIATED]->(txn_inv2);
MERGE (txn_inv1)-[:FUNDS_TO]->(account_hk);
MERGE (txn_inv2)-[:FUNDS_TO]->(account_hk);
MERGE (account_hk)-[:OWNED_BY]->(org_shell);

// ---------- Case 2: 公检法冒充 ----------
MERGE (fraud_zhao:Fraudster {code:'FRAUD-ZHAO', name:'赵凯', alias:'督查专员'})
  SET fraud_zhao.location='柬埔寨西哈努克',
      fraud_zhao.role='话术主管',
      fraud_zhao.risk_level='high';

MERGE (fraud_li:Fraudster {code:'FRAUD-LI', name:'李航', alias:'专案组客服'})
  SET fraud_li.location='柬埔寨西哈努克',
      fraud_li.role='拨号员',
      fraud_li.risk_level='medium';

MERGE (victim_wu:Victim {code:'VICTIM-WU'})
  SET victim_wu.name='吴先生',
      victim_wu.city='南京',
      victim_wu.age=36,
      victim_wu.occupation='物流经理',
      victim_wu.loss_amount=180000;

MERGE (case_law:Case {code:'CASE-LAW-2024-009'})
  SET case_law.title='“安全账户”转账骗局',
      case_law.status='investigating',
      case_law.loss_amount=180000,
      case_law.start_date=date('2024-09-20'),
      case_law.level='二级预警';

MERGE (account_safe:Account {code:'ACC-SAFE-5522'})
  SET account_safe.bank='东盟联合银行',
      account_safe.country='老挝',
      account_safe.type='中转账户',
      account_safe.risk_level='high';

MERGE (txn_law:Transaction {tx_id:'TX-LAW-001'})
  SET txn_law.amount=180000,
      txn_law.currency='CNY',
      txn_law.method='bank_transfer',
      txn_law.tx_date=date('2024-09-22');

MERGE (fraud_li)-[:USES_DEVICE]->(device_dialer);
MERGE (fraud_zhao)-[:COORDINATES_WITH]->(fraud_li);
MERGE (fraud_zhao)-[:RUNS_CASE]->(case_law);
MERGE (case_law)-[:BELONGS_TO]->(law);
MERGE (law)-[:EXPLOITS]->(trigger_fear);
MERGE (case_law)-[:USES_CHANNEL]->(channel_phone);
MERGE (case_law)-[:TARGETS]->(victim_wu);
MERGE (case_law)-[:HAS_TRANSACTION]->(txn_law);
MERGE (victim_wu)-[:INITIATED]->(txn_law);
MERGE (txn_law)-[:FUNDS_TO]->(account_safe);
MERGE (account_safe)-[:OWNED_BY]->(org_exchange);

// ---------- Case 3: 情感陪聊诈骗 ----------
MERGE (fraud_anna:Fraudster {code:'FRAUD-ANNA', name:'Anna', alias:'安娜'})
  SET fraud_anna.location='迪拜',
      fraud_anna.role='话术执行',
      fraud_anna.risk_level='medium';

MERGE (fraud_james:Fraudster {code:'FRAUD-JAMES', name:'James', alias:'风控教练'})
  SET fraud_james.location='迪拜',
      fraud_james.role='资金协调',
      fraud_james.risk_level='medium';

MERGE (victim_liu:Victim {code:'VICTIM-LIU'})
  SET victim_liu.name='刘小姐',
      victim_liu.city='成都',
      victim_liu.age=29,
      victim_liu.occupation='UI设计师',
      victim_liu.loss_amount=95000;

MERGE (case_romance:Case {code:'CASE-ROMANCE-2024-004'})
  SET case_romance.title='跨境恋爱投资局',
      case_romance.status='open',
      case_romance.loss_amount=95000,
      case_romance.start_date=date('2024-07-11'),
      case_romance.level='三级预警';

MERGE (account_usdt:Account {code:'ACC-USDT-7788'})
  SET account_usdt.bank='USDT钱包地址',
      account_usdt.country='新加坡',
      account_usdt.type='crypto_wallet',
      account_usdt.asset='USDT',
      account_usdt.risk_level='medium';

MERGE (txn_rom1:Transaction {tx_id:'TX-ROM-001'})
  SET txn_rom1.amount=50000,
      txn_rom1.currency='CNY',
      txn_rom1.method='crypto_purchase',
      txn_rom1.tx_date=date('2024-07-28');

MERGE (txn_rom2:Transaction {tx_id:'TX-ROM-002'})
  SET txn_rom2.amount=45000,
      txn_rom2.currency='CNY',
      txn_rom2.method='crypto_purchase',
      txn_rom2.tx_date=date('2024-08-05');

MERGE (fraud_anna)-[:USES_DEVICE]->(device_mac);
MERGE (fraud_anna)-[:COORDINATES_WITH]->(fraud_james);
MERGE (fraud_anna)-[:RUNS_CASE]->(case_romance);
MERGE (case_romance)-[:BELONGS_TO]->(romance);
MERGE (romance)-[:EXPLOITS]->(trigger_emotion);
MERGE (case_romance)-[:USES_CHANNEL]->(channel_app);
MERGE (case_romance)-[:TARGETS]->(victim_liu);
MERGE (case_romance)-[:HAS_TRANSACTION]->(txn_rom1);
MERGE (case_romance)-[:HAS_TRANSACTION]->(txn_rom2);
MERGE (victim_liu)-[:INITIATED]->(txn_rom1);
MERGE (victim_liu)-[:INITIATED]->(txn_rom2);
MERGE (txn_rom1)-[:FUNDS_TO]->(account_usdt);
MERGE (txn_rom2)-[:FUNDS_TO]->(account_usdt);
MERGE (account_usdt)-[:CUSTODIED_BY]->(org_wallet);

// ---------- Cross-case intelligence ----------
MERGE (fraud_lin)-[:COORDINATES_WITH]->(fraud_zhao);
MERGE (fraud_zhao)-[:COORDINATES_WITH]->(fraud_anna);
MERGE (channel_wechat)-[:SHARES_INFRA]->(channel_app);
MERGE (account_hk)-[:FUNDS_ROUTED_TO]->(account_usdt);
MERGE (trigger_high)-[:RELATED_TO]->(trigger_emotion);

RETURN 'neo4j seed complete' AS status;
