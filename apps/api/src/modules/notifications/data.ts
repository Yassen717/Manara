import { AppNotification } from '../../common/types';
import { daysAgo, nextId } from '../../data/seed';

// Bilingual seed notifications for the demo citizen. Other NINs get a single
// welcome notification generated on first access (see notifications.service).
const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'ntf_0001',
    kind: 'success',
    title: 'Salary credited',
    titleAr: 'تم إيداع المرتب',
    body: 'Your October public-sector salary of 1,240.00 LYD has been credited to your wallet.',
    bodyAr: 'تم إيداع مرتبك عن شهر أكتوبر بقيمة 1,240.00 دينار ليبي في محفظتك.',
    at: hoursAgo(3),
    read: false,
  },
  {
    id: 'ntf_0002',
    kind: 'warning',
    title: 'Planned power outage in your area',
    titleAr: 'انقطاع مخطط للكهرباء في منطقتك',
    body: 'GECOL will maintain the Hay Al-Andalus substation on Friday from 09:00 to 15:00. Expect a full outage during the window.',
    bodyAr: 'ستقوم الشركة العامة للكهرباء بصيانة محطة حي الأندلس يوم الجمعة من الساعة 09:00 إلى 15:00. توقع انقطاعاً كاملاً خلال هذه الفترة.',
    at: hoursAgo(6),
    read: false,
  },
  {
    id: 'ntf_0003',
    kind: 'success',
    title: 'Passport application approved',
    titleAr: 'تمت الموافقة على طلب جواز السفر',
    body: 'Application MNR-2026-00087 was approved. Your passport is ready for pickup at the Tripoli Center civil registry office.',
    bodyAr: 'تمت الموافقة على الطلب MNR-2026-00087. جوازك جاهز للاستلام من مكتب السجل المدني في طرابلس المركز.',
    at: daysAgo(1),
    read: false,
  },
  {
    id: 'ntf_0004',
    kind: 'info',
    title: 'Childhood vaccination campaign',
    titleAr: 'حملة تطعيم الأطفال',
    body: 'The Ministry of Health is running a polio and measles vaccination campaign in Tripoli municipality clinics this week.',
    bodyAr: 'تنظم وزارة الصحة حملة تطعيم ضد شلل الأطفال والحصبة في عيادات بلدية طرابلس هذا الأسبوع.',
    at: daysAgo(2),
    read: false,
  },
  {
    id: 'ntf_0005',
    kind: 'warning',
    title: 'Electricity bill due',
    titleAr: 'فاتورة الكهرباء مستحقة',
    body: 'Your September electricity bill of 96.50 LYD is due in 5 days. Pay online to avoid reconnection fees.',
    bodyAr: 'فاتورة كهرباء سبتمبر بقيمة 96.50 دينار ليبي مستحقة خلال 5 أيام. ادفع عبر الإنترنت لتجنب رسوم إعادة التوصيل.',
    at: daysAgo(3),
    read: true,
  },
  {
    id: 'ntf_0006',
    kind: 'info',
    title: 'Family grant scheduled',
    titleAr: 'تمت جدولة منحة الأسرة',
    body: 'Your quarterly family allowance of 450.00 LYD is scheduled for next week.',
    bodyAr: 'تمت جدولة منحة الأسرة الفصلية بقيمة 450.00 دينار ليبي للأسبوع القادم.',
    at: daysAgo(4),
    read: true,
  },
  {
    id: 'ntf_0007',
    kind: 'alert',
    title: 'Water supply interruption',
    titleAr: 'انقطاع إمدادات المياه',
    body: 'Man-Made River pumping was reduced after power failures; expect low water pressure in coastal districts for 48 hours.',
    bodyAr: 'انخفض ضخ النهر الصناعي بعد انقطاعات الكهرباء؛ توقعوا ضعف ضغط المياه في المناطق الساحلية لمدة 48 ساعة.',
    at: daysAgo(6),
    read: true,
  },
  {
    id: 'ntf_0008',
    kind: 'success',
    title: 'Service request update',
    titleAr: 'تحديث على بلاغ الخدمة',
    body: 'Your waste-collection report REQ-2026-00098 was dispatched to the Janzour sanitation contractor.',
    bodyAr: 'تم إرسال بلاغك عن تراكم النفايات REQ-2026-00098 إلى مقاول النظافة في جنزور.',
    at: daysAgo(8),
    read: true,
  },
];

export function welcomeNotification(): AppNotification {
  return {
    id: nextId('ntf'),
    kind: 'info',
    title: 'Welcome to Manara',
    titleAr: 'مرحباً بك في منارة',
    body: 'Your citizen account is ready. Complete eKYC verification to unlock all government services.',
    bodyAr: 'حسابك كمواطن جاهز. أكمل التحقق الإلكتروني من الهوية للوصول إلى جميع الخدمات الحكومية.',
    at: new Date().toISOString(),
    read: false,
  };
}
