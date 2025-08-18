import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle, AlertCircle, Info, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'premium';
  titleKey: string;
  messageKey: string;
  actionKey?: string;
  actionUrl?: string;
  dismissible?: boolean;
  persistent?: boolean;
  createdAt: number;
}

export const NotificationCenter = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 8000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    // Check for contextual notifications
    const checkUrl = window.location.search;
    
    if (checkUrl.includes('onboarding=true') && user) {
      addNotification({
        type: 'success',
        titleKey: 'notifications.welcome.title',
        messageKey: 'notifications.welcome.message',
        actionKey: 'notifications.welcome.action',
        actionUrl: '/profile',
        persistent: true
      });
    }

    if (checkUrl.includes('payment=success')) {
      addNotification({
        type: 'premium',
        titleKey: 'notifications.payment.success.title',
        messageKey: 'notifications.payment.success.message',
        actionKey: 'notifications.payment.success.action',
        actionUrl: '/book',
        persistent: true
      });
    }

    if (checkUrl.includes('subscription=canceled')) {
      addNotification({
        type: 'info',
        titleKey: 'notifications.subscription.canceled.title',
        messageKey: 'notifications.subscription.canceled.message',
        persistent: true
      });
    }
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'premium': return Crown;
      default: return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'premium': return 'text-primary';
      default: return 'text-blue-500';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
            {notifications.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 z-50 opacity-100 scale-100 transition-all">
          <Card className="shadow-xl border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {t('notifications.title')}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div key={notification.id} className="flex gap-3 p-3 rounded-lg border bg-card/50 opacity-100 transition-opacity">
                    <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(notification.type)}`} />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm">
                        {t(notification.titleKey)}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {t(notification.messageKey)}
                      </p>
                      {notification.actionKey && notification.actionUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => {
                            window.location.href = notification.actionUrl!;
                            removeNotification(notification.id);
                          }}
                        >
                          {t(notification.actionKey)}
                        </Button>
                      )}
                    </div>
                    {notification.dismissible !== false && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};