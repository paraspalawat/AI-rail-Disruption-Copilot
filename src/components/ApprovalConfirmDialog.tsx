import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ApprovalConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionTitle: string;
  onConfirm: () => Promise<void>;
  countdownSeconds?: number;
}

export function ApprovalConfirmDialog({
  open,
  onOpenChange,
  actionTitle,
  onConfirm,
  countdownSeconds = 10,
}: ApprovalConfirmDialogProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const resetState = useCallback(() => {
    setCountdown(countdownSeconds);
    setIsCountingDown(false);
    setIsApplying(false);
  }, [countdownSeconds]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      handleApply();
    }

    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const handleStartCountdown = () => {
    setIsCountingDown(true);
  };

  const handleCancel = () => {
    resetState();
    onOpenChange(false);
  };

  const handleApply = async () => {
    setIsApplying(true);
    setIsCountingDown(false);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to apply action:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const progress = ((countdownSeconds - countdown) / countdownSeconds) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Confirm Action
          </DialogTitle>
          <DialogDescription>
            {isCountingDown ? (
              <>Changes will be applied in <span className="font-bold text-primary">{countdown}</span> seconds.</>
            ) : (
              "Are you sure you want to approve this AI recommendation?"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="font-medium text-sm">{actionTitle}</p>
          </div>

          {isCountingDown && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                Click "Cancel" to stop and revert
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          {!isCountingDown && !isApplying && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleStartCountdown} variant="railway">
                Confirm (10s hold)
              </Button>
            </>
          )}
          {isCountingDown && (
            <Button variant="destructive" onClick={handleCancel} className="w-full">
              Cancel
            </Button>
          )}
          {isApplying && (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying changes...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
