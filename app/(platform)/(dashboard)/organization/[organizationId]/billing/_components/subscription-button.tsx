"use client";

import { stripeRedirect } from "@/actions/stripe-redirected";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModel } from "@/hooks/use-pro-modal";
import { toast } from "sonner";


interface SubscriptionButtonProps {
    isPro: boolean;
};

const SubscriptionButton = ({
    isPro,
}: SubscriptionButtonProps) => {
    const proModal = useProModel();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onClick = () => {
        if (isPro) {
            execute({});
        } else {
            proModal.onOpen();
        }
    }

  return (
    <Button disabled={isLoading} onClick={onClick}>
        {isPro ? "Manage subscription" : "Upgrade to pro"}
    </Button>
  )
}

export default SubscriptionButton

