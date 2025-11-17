import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { banner } from "@/hooks/use-banner";

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
  amount: number;
  currency: string;
}

export const StripePaymentForm = ({ onSuccess, onBack, amount, currency }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/customer/bookings`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        banner.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        banner.success('Payment successful!');
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred');
      banner.error(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold">
                  {currency === 'EUR' ? '€' : '$'}{amount.toFixed(2)}
                </span>
              </div>
            </div>

            <PaymentElement />
          </div>

          {errorMessage && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isProcessing}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${currency === 'EUR' ? '€' : '$'}${amount.toFixed(2)}`
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your payment information is encrypted and secure
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
