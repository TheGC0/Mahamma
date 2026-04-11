import { Button } from "./ui/button";
import { notify } from "../lib/notifications.tsx";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  MessageCircle,
  DollarSign,
  Bell,
  Sparkles,
  Zap,
  Rocket,
  Code2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * NotificationDemo Component
 * Demonstrates all the notification types available in the Mahamma platform
 */
export function NotificationDemo() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Bell className="h-12 w-12 text-[#F7931E] animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            نظام الإشعارات
          </h1>
          <Bell className="h-12 w-12 text-[#F7931E] animate-pulse" />
        </div>
        <p className="text-xl text-muted-foreground">
          Mahamma Notification System Demo
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          اختبر جميع أنواع الإشعارات في منصة مهمة. انقر على أي زر لعرض الإشعار
        </p>
      </div>

      <Separator />

      {/* Basic Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#F7931E]" />
            Basic Notifications - الإشعارات الأساسية
          </CardTitle>
          <CardDescription>
            Core notification types with different statuses and styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() =>
                notify.success("تم الحفظ بنجاح!", {
                  description: "تم حفظ جميع التغييرات بنجاح",
                })
              }
              className="bg-[#10b981] hover:bg-[#059669] text-white flex items-center gap-2 h-auto py-4 flex-col"
            >
              <CheckCircle2 className="h-6 w-6" />
              <div className="text-sm">Success</div>
              <div className="text-xs opacity-80">نجاح</div>
            </Button>

            <Button
              onClick={() =>
                notify.error("حدث خطأ!", {
                  description: "فشل في حفظ البيانات. يرجى المحاولة مرة أخرى",
                })
              }
              className="bg-destructive hover:bg-destructive/90 text-white flex items-center gap-2 h-auto py-4 flex-col"
            >
              <XCircle className="h-6 w-6" />
              <div className="text-sm">Error</div>
              <div className="text-xs opacity-80">خطأ</div>
            </Button>

            <Button
              onClick={() =>
                notify.warning("تحذير مهم!", {
                  description: "يرجى مراجعة البيانات المدخلة قبل المتابعة",
                })
              }
              className="bg-[#F7931E] hover:bg-[#e8841a] text-white flex items-center gap-2 h-auto py-4 flex-col"
            >
              <AlertTriangle className="h-6 w-6" />
              <div className="text-sm">Warning</div>
              <div className="text-xs opacity-80">تحذير</div>
            </Button>

            <Button
              onClick={() =>
                notify.info("معلومة جديدة", {
                  description: "يتوفر تحديث جديد للنظام. قم بالتحديث الآن",
                })
              }
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center gap-2 h-auto py-4 flex-col"
            >
              <Info className="h-6 w-6" />
              <div className="text-sm">Info</div>
              <div className="text-xs opacity-80">معلومة</div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform-Specific Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-[#F7931E]" />
            Platform Notifications - إشعارات المنصة
          </CardTitle>
          <CardDescription>
            Real-world notifications specific to Mahamma platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() =>
                notify.newMessage(
                  "أحمد محمد",
                  "مرحباً، أريد مناقشة تفاصيل المشروع معك",
                )
              }
              variant="outline"
              className="flex items-center gap-3 justify-start h-auto py-4 border-2 hover:border-[#F7931E] hover:bg-[#F7931E]/5"
            >
              <MessageCircle className="h-8 w-8 text-[#F7931E] flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">رسالة جديدة</div>
                <div className="text-sm text-muted-foreground">
                  New Message Notification
                </div>
              </div>
            </Button>

            <Button
              onClick={() =>
                notify.newOffer("سارة أحمد", "تصميم شعار احترافي لشركة ناشئة")
              }
              variant="outline"
              className="flex items-center gap-3 justify-start h-auto py-4 border-2 hover:border-[#10b981] hover:bg-[#10b981]/5"
            >
              <DollarSign className="h-8 w-8 text-[#10b981] flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">عرض جديد على مهمتك</div>
                <div className="text-sm text-muted-foreground">
                  New Offer Received
                </div>
              </div>
            </Button>

            <Button
              onClick={() => notify.taskAccepted("خالد العلي")}
              variant="outline"
              className="flex items-center gap-3 justify-start h-auto py-4 border-2 hover:border-[#10b981] hover:bg-[#10b981]/5"
            >
              <CheckCircle2 className="h-8 w-8 text-[#10b981] flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">تم قبول عرضك</div>
                <div className="text-sm text-muted-foreground">
                  Your Offer Was Accepted
                </div>
              </div>
            </Button>

            <Button
              onClick={() => notify.paymentReceived(750)}
              variant="outline"
              className="flex items-center gap-3 justify-start h-auto py-4 border-2 hover:border-[#10b981] hover:bg-[#10b981]/5"
            >
              <DollarSign className="h-8 w-8 text-[#10b981] flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">تم استلام الدفعة</div>
                <div className="text-sm text-muted-foreground">
                  Payment Received
                </div>
              </div>
            </Button>

            <Button
              onClick={() =>
                notify.notification(
                  "تذكير: موعد التسليم غداً",
                  "لديك مهمة يجب تسليمها خلال 24 ساعة",
                )
              }
              variant="outline"
              className="flex items-center gap-3 justify-start h-auto py-4 border-2 hover:border-[#F7931E] hover:bg-[#F7931E]/5"
            >
              <Bell className="h-8 w-8 text-[#F7931E] flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">إشعار عام</div>
                <div className="text-sm text-muted-foreground">
                  General Notification
                </div>
              </div>
            </Button>

            <Button
              onClick={() =>
                notify.custom("مبروك! أكملت 10 مهام", {
                  description: "أنت من أفضل المستخدمين هذا الشهر",
                  icon: <Sparkles className="h-5 w-5 text-[#F7931E]" />,
                })
              }
              variant="outline"
              className="flex items-center gap-3 justify-start h-auto py-4 border-2 hover:border-[#F7931E] hover:bg-[#F7931E]/5"
            >
              <Zap className="h-8 w-8 text-[#F7931E] flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">إشعار مخصص</div>
                <div className="text-sm text-muted-foreground">
                  Custom Notification
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#F7931E]" />
            Order Status Updates - تحديثات حالة الطلب
          </CardTitle>
          <CardDescription>
            Status change notifications for orders and tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => notify.orderUpdate("in-progress", "12345")}
              variant="outline"
              className="h-auto py-4 border-2 hover:border-[#3b82f6]"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#3b82f6]" />
                <div className="font-semibold">قيد التنفيذ</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
            </Button>

            <Button
              onClick={() => notify.orderUpdate("delivered", "12345")}
              variant="outline"
              className="h-auto py-4 border-2 hover:border-[#F7931E]"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#F7931E]" />
                <div className="font-semibold">تم التسليم</div>
                <div className="text-xs text-muted-foreground">Delivered</div>
              </div>
            </Button>

            <Button
              onClick={() => notify.orderUpdate("completed", "12345")}
              variant="outline"
              className="h-auto py-4 border-2 hover:border-[#10b981]"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#10b981]" />
                <div className="font-semibold">مكتمل</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </Button>

            <Button
              onClick={() => notify.orderUpdate("cancelled", "12345")}
              variant="outline"
              className="h-auto py-4 border-2 hover:border-destructive"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <div className="font-semibold">ملغي</div>
                <div className="text-xs text-muted-foreground">Cancelled</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-[#F7931E]" />
            Interactive & Advanced - إشعارات تفاعلية ومتقدمة
          </CardTitle>
          <CardDescription>
            Notifications with action buttons, promises, and custom durations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div>
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
              WITH ACTION BUTTONS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() =>
                  notify.success("تم إنشاء المهمة بنجاح", {
                    description: "المهمة جاهزة للنشر",
                    action: {
                      label: "عرض المهمة",
                      onClick: () =>
                        notify.info("سيتم الانتقال إلى صفحة المهمة"),
                    },
                  })
                }
                variant="outline"
                className="justify-start"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Notification with Action
              </Button>

              <Button
                onClick={() =>
                  notify.warning("انتبه! المهمة قاربت على الانتهاء", {
                    description: "باقي 2 ساعة على موعد التسليم",
                    action: {
                      label: "تسليم الآن",
                      onClick: () => notify.success("تم التسليم!"),
                    },
                  })
                }
                variant="outline"
                className="justify-start"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Warning with Action
              </Button>
            </div>
          </div>

          {/* Promise Notifications */}
          <div>
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
              PROMISE-BASED LOADING
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  const promise = new Promise((resolve) =>
                    setTimeout(() => resolve("Done!"), 2000),
                  );
                  notify.promise(promise, {
                    loading: "جاري حفظ البيانات...",
                    success: "تم حفظ البيانات بنجاح!",
                    error: "فشل في حفظ البيانات",
                  });
                }}
                variant="outline"
                className="justify-start"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Success Promise (2s)
              </Button>

              <Button
                onClick={() => {
                  const promise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Failed")), 2000),
                  );
                  notify.promise(promise, {
                    loading: "جاري رفع الملفات...",
                    success: "تم رفع الملفات!",
                    error: "فشل في رفع الملفات. حاول مرة أخرى",
                  });
                }}
                variant="outline"
                className="justify-start"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Error Promise (2s)
              </Button>
            </div>
          </div>

          {/* Custom Durations */}
          <div>
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
              CUSTOM DURATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() =>
                  notify.info("إشعار سريع جداً", { duration: 1500 })
                }
                variant="outline"
                size="sm"
              >
                Quick (1.5s)
              </Button>

              <Button
                onClick={() => notify.info("إشعار عادي", { duration: 4000 })}
                variant="outline"
                size="sm"
              >
                Normal (4s)
              </Button>

              <Button
                onClick={() =>
                  notify.info("إشعار طويل للقراءة", {
                    duration: 10000,
                    description:
                      "هذا إشعار يبقى لفترة أطول لإعطاء المستخدم وقتاً كافياً للقراءة",
                  })
                }
                variant="outline"
                size="sm"
              >
                Long (10s)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="bg-gradient-to-br from-[#F7931E]/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-[#F7931E]" />
            Usage Examples - أمثلة الاستخدام
          </CardTitle>
          <CardDescription>
            Copy and use these code snippets in your Mahamma components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/90 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
              {`import { notify } from '../lib/notifications.tsx';

// ✅ Basic notifications
notify.success("تم الحفظ بنجاح!");
notify.error("حدث خطأ!");
notify.warning("تحذير!");
notify.info("معلومة جديدة");

// 📝 With description
notify.success("تم الحفظ", {
  description: "تم حفظ جميع التغييرات بنجاح"
});

// 🔘 With action button
notify.success("تم إنشاء المهمة", {
  description: "المهمة جاهزة للنشر",
  action: {
    label: "عرض",
    onClick: () => navigate('/task/123')
  }
});

// 🚀 Platform-specific
notify.newMessage("أحمد محمد", "مرحباً بك");
notify.newOffer("سارة أحمد", "تصميم شعار");
notify.taskAccepted("خالد العلي");
notify.paymentReceived(500);
notify.orderUpdate('completed', '12345');

// ⏳ Promise notifications (loading states)
const savePromise = saveTaskToDatabase();
notify.promise(savePromise, {
  loading: "جاري الحفظ...",
  success: "تم الحفظ بنجاح!",
  error: "فشل في الحفظ"
});

// ⏱️ Custom duration
notify.info("إشعار مخصص", { duration: 8000 });

// 🎨 Custom notification
notify.custom("مبروك!", {
  description: "أنت أفضل مستخدم",
  icon: <Sparkles className="h-5 w-5 text-[#F7931E]" />
});`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Test All Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={() => {
            setTimeout(() => notify.success("نجاح!"), 100);
            setTimeout(() => notify.error("خطأ!"), 600);
            setTimeout(() => notify.warning("تحذير!"), 1100);
            setTimeout(() => notify.info("معلومة!"), 1600);
            setTimeout(() => notify.newMessage("أحمد", "مرحباً"), 2100);
          }}
          className="bg-gradient-to-r from-[#F7931E] to-[#e8841a] hover:from-[#e8841a] hover:to-[#d97818] text-white px-8 py-6 text-lg"
          size="lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          اختبر جميع الإشعارات (Test All)
        </Button>
      </div>
    </div>
  );
}
