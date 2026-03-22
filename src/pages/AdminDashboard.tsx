import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Train, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  XCircle,
  CloudRain,
  Wrench,
  Activity,
  LogOut,
  RefreshCw,
  Bell,
  Settings,
  AlertCircle,
  ThumbsUp,
  Edit,
  X,
  History,
  Zap,
  Megaphone,
  Brain,
  Thermometer,
  Eye,
  Wind,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRailwayData, useRailwayActions, AIAction, Alert, Train as TrainType } from "@/hooks/useRailwayData";
import { ApprovalConfirmDialog } from "@/components/ApprovalConfirmDialog";

const AdminDashboard = () => {
  const { trains, alerts, announcements, aiActions, actionLogs, weather, loading, refetch } = useRailwayData();
  const { 
    generateRecommendations, 
    analyzeRisk, 
    approveAction, 
    modifyAction, 
    dismissAction, 
    sendAnnouncement, 
    acknowledgeAlert,
    fetchWeather,
    loading: actionLoading 
  } = useRailwayActions();
  
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [modifiedDescription, setModifiedDescription] = useState("");
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState<"all" | "passengers" | "staff">("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab] = useState("monitoring");
  const [generatingAI, setGeneratingAI] = useState(false);
  
  // Approval confirmation dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [pendingApprovalAction, setPendingApprovalAction] = useState<AIAction | null>(null);
  
  // Track if AI recommendations have been generated for current session
  const lastAIGenerationRef = useRef<number>(0);
  const AI_GENERATION_COOLDOWN = 30000; // 30 seconds cooldown

  // Stats calculations
  const onTimeCount = trains.filter(t => t.status === "on_time").length;
  const atRiskCount = trains.filter(t => t.risk_level === "medium" || t.risk_level === "high").length;
  const delayedCount = trains.filter(t => t.status === "delayed").length;
  const pendingActions = aiActions.filter(a => a.status === "pending").length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  // Auto-generate AI recommendations function
  const autoGenerateRecommendations = useCallback(async () => {
    const now = Date.now();
    // Prevent generating if recently generated or already generating
    if (generatingAI || now - lastAIGenerationRef.current < AI_GENERATION_COOLDOWN) {
      return;
    }
    
    lastAIGenerationRef.current = now;
    setGeneratingAI(true);
    
    try {
      await fetchWeather();
      await generateRecommendations();
      toast({
        title: "AI Recommendations Updated",
        description: "New AI-powered recommendations have been generated automatically.",
      });
    } catch (error) {
      console.error("Failed to auto-generate AI recommendations:", error);
    } finally {
      setGeneratingAI(false);
    }
  }, [fetchWeather, generateRecommendations, generatingAI]);

  // Refresh data and auto-generate AI recommendations
  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
    
    // Auto-generate AI recommendations on refresh
    await autoGenerateRecommendations();
    
    toast({
      title: "Data Refreshed",
      description: "All railway data has been updated with new AI recommendations.",
    });
  };

  const handleAnalyzeRisk = async () => {
    setGeneratingAI(true);
    try {
      await analyzeRisk();
      toast({
        title: "Risk Analysis Complete",
        description: "Train risk levels have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze risk.",
        variant: "destructive",
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  // Show approval confirmation dialog
  const handleApproveClick = (action: AIAction) => {
    setPendingApprovalAction(action);
    setApprovalDialogOpen(true);
  };

  // Actually approve the action after countdown
  const handleConfirmApproval = async () => {
    if (!pendingApprovalAction) return;
    
    try {
      await approveAction(pendingApprovalAction.id, pendingApprovalAction.title);
      toast({
        title: "Action Approved",
        description: `"${pendingApprovalAction.title}" has been approved and executed.`,
      });
      setPendingApprovalAction(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve action.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleModifyClick = (action: AIAction) => {
    setSelectedAction(action);
    setModifiedDescription(action.description);
    setModifyDialogOpen(true);
  };

  const handleModifySubmit = async () => {
    if (selectedAction && modifiedDescription.trim()) {
      try {
        await modifyAction(selectedAction.id, selectedAction.title, modifiedDescription);
        toast({
          title: "Action Modified",
          description: `"${selectedAction.title}" has been modified and saved.`,
        });
        setModifyDialogOpen(false);
        setSelectedAction(null);
        setModifiedDescription("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to modify action.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDismiss = async (action: AIAction) => {
    try {
      await dismissAction(action.id, action.title);
      toast({
        title: "Action Dismissed",
        description: `"${action.title}" has been dismissed.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss action.",
        variant: "destructive",
      });
    }
  };

  const handleAcknowledgeAlert = async (alert: Alert) => {
    try {
      await acknowledgeAlert(alert.id, alert.title);
      toast({
        title: "Alert Acknowledged",
        description: "Alert has been marked as acknowledged.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert.",
        variant: "destructive",
      });
    }
  };

  const handleSendAnnouncement = async () => {
    if (newAnnouncement.trim()) {
      try {
        await sendAnnouncement(newAnnouncement, announcementTarget, "Staff Announcement");
        toast({
          title: "Announcement Sent",
          description: `Announcement has been broadcast to ${announcementTarget === "all" ? "all users" : announcementTarget}.`,
        });
        setAnnouncementDialogOpen(false);
        setNewAnnouncement("");
        setAnnouncementTarget("all");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send announcement.",
          variant: "destructive",
        });
      }
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Low</Badge>;
      case "medium": return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Medium</Badge>;
      case "high": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">High</Badge>;
      case "critical": return <Badge variant="outline" className="bg-destructive text-white">Critical</Badge>;
      default: return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "weather": return <CloudRain className="h-5 w-5" />;
      case "maintenance": return <Wrench className="h-5 w-5" />;
      case "technical": return <AlertCircle className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return <Badge className="bg-destructive text-white">Critical</Badge>;
      case "high": return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "medium": return <Badge variant="secondary">Medium</Badge>;
      case "low": return <Badge variant="outline">Low</Badge>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-success text-white">Approved</Badge>;
      case "modified": return <Badge className="bg-primary text-white">Modified</Badge>;
      case "dismissed": return <Badge variant="outline" className="text-muted-foreground">Dismissed</Badge>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading railway data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-3 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
              <Train className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Rail Disruption Co-pilot</h1>
              <p className="text-xs text-primary-foreground/70">AI-Powered Control Room</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 relative"
              onClick={() => setActiveTab("actions")}
            >
              <Bell className="h-5 w-5" />
              {(pendingActions + unacknowledgedAlerts) > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingActions + unacknowledgedAlerts}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setAnnouncementDialogOpen(true)}
            >
              <Megaphone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10 ml-2">
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{onTimeCount}</p>
                <p className="text-xs text-muted-foreground">On Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{atRiskCount}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{delayedCount}</p>
                <p className="text-xs text-muted-foreground">Delayed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trains.length}</p>
                <p className="text-xs text-muted-foreground">Active Trains</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingActions}</p>
                <p className="text-xs text-muted-foreground">AI Actions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unacknowledgedAlerts}</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* AI Controls */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-6 border border-primary/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-semibold">AI Control Center</h2>
                <p className="text-sm text-muted-foreground">
                  Last refresh: {lastRefresh.toLocaleTimeString()}
                  {generatingAI && " • Generating recommendations..."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={actionLoading || generatingAI}>
                {generatingAI ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Refresh Data
              </Button>
              <Button onClick={handleAnalyzeRisk} variant="secondary" size="sm" disabled={generatingAI}>
                {generatingAI ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                Analyze Risk
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="monitoring">
              <Train className="h-4 w-4 mr-2" />
              Train Monitoring
            </TabsTrigger>
            <TabsTrigger value="actions">
              <Zap className="h-4 w-4 mr-2" />
              AI Actions ({pendingActions})
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts ({unacknowledgedAlerts})
            </TabsTrigger>
            <TabsTrigger value="weather">
              <CloudRain className="h-4 w-4 mr-2" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="logs">
              <History className="h-4 w-4 mr-2" />
              Action Logs
            </TabsTrigger>
          </TabsList>

          {/* Train Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <Train className="h-5 w-5 text-primary" />
                  Live Train Monitoring
                </h2>
                <Badge variant="outline" className="text-xs">
                  Real-time Updates
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Train</th>
                      <th className="text-left p-3 text-sm font-medium">Route</th>
                      <th className="text-left p-3 text-sm font-medium">Location</th>
                      <th className="text-left p-3 text-sm font-medium">Status</th>
                      <th className="text-left p-3 text-sm font-medium">Delay</th>
                      <th className="text-left p-3 text-sm font-medium">Risk</th>
                      <th className="text-left p-3 text-sm font-medium">Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trains.map((train) => (
                      <tr key={train.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{train.train_number}</p>
                            <p className="text-sm text-muted-foreground">{train.train_name}</p>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{train.origin} → {train.destination}</td>
                        <td className="p-3 text-sm">{train.current_location || "N/A"}</td>
                        <td className="p-3">
                          <Badge className={
                            train.status === "on_time" ? "bg-success text-white" :
                            train.status === "delayed" ? "bg-destructive text-white" :
                            "bg-warning text-warning-foreground"
                          }>
                            {train.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {train.delay_minutes > 0 ? (
                            <span className="text-destructive font-medium">{train.delay_minutes} min</span>
                          ) : (
                            <span className="text-success">On time</span>
                          )}
                        </td>
                        <td className="p-3">{getRiskBadge(train.risk_level)}</td>
                        <td className="p-3 text-sm">{train.speed_kmh ? `${train.speed_kmh} km/h` : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* AI Actions Tab */}
          <TabsContent value="actions">
            <div className="space-y-4">
              {aiActions.filter(a => a.status === "pending").length === 0 ? (
                <div className="bg-card rounded-xl p-8 text-center border border-border">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Pending AI Actions</h3>
                  <p className="text-muted-foreground mb-4">
                    AI recommendations are generated automatically when you click "Refresh Data".
                  </p>
                  <Button onClick={handleRefresh} disabled={generatingAI}>
                    {generatingAI ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Refresh to Generate
                  </Button>
                </div>
              ) : (
                aiActions.filter(a => a.status === "pending").map((action) => (
                  <div key={action.id} className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {getPriorityBadge(action.priority)}
                          <Badge variant="outline">{action.action_type.replace("_", " ")}</Badge>
                          {action.risk_score && (
                            <span className="text-xs text-muted-foreground">
                              Risk Score: {(Number(action.risk_score) * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                        {action.ai_reasoning && (
                          <div className="bg-primary/5 rounded-lg p-3 text-sm border border-primary/10">
                            <p className="font-medium text-primary mb-1 flex items-center gap-1">
                              <Brain className="h-4 w-4" /> AI Reasoning
                            </p>
                            <p className="text-muted-foreground">{action.ai_reasoning}</p>
                          </div>
                        )}
                        {action.affected_trains && action.affected_trains.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Affected trains: {action.affected_trains.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => handleApproveClick(action)} disabled={actionLoading}>
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleModifyClick(action)} disabled={actionLoading}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modify
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDismiss(action)} disabled={actionLoading}>
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Processed Actions */}
              {aiActions.filter(a => a.status !== "pending").length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-4 text-muted-foreground">Processed Actions</h3>
                  <div className="space-y-2">
                    {aiActions.filter(a => a.status !== "pending").slice(0, 5).map((action) => (
                      <div key={action.id} className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(action.status)}
                          <span className="text-sm">{action.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {action.processed_at ? new Date(action.processed_at).toLocaleTimeString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="bg-card rounded-xl p-8 text-center border border-border">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">All systems operating normally.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`rounded-xl p-4 border ${
                      alert.severity === "critical" 
                        ? "bg-destructive/5 border-destructive/30" 
                        : "bg-warning/5 border-warning/30"
                    } ${alert.acknowledged ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        alert.severity === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                      }`}>
                        {getAlertIcon(alert.alert_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge className={alert.severity === "critical" ? "bg-destructive" : "bg-warning"}>
                            {alert.severity}
                          </Badge>
                          {alert.acknowledged && (
                            <Badge variant="outline" className="text-success border-success">
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        {alert.affected_routes && (
                          <p className="text-xs text-muted-foreground">
                            Affected routes: {alert.affected_routes.join(", ")}
                          </p>
                        )}
                      </div>
                      {!alert.acknowledged && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleAcknowledgeAlert(alert)}
                          disabled={actionLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weather.length === 0 ? (
                <div className="col-span-full bg-card rounded-xl p-8 text-center border border-border">
                  <CloudRain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Weather Data</h3>
                  <p className="text-muted-foreground mb-4">Click refresh to fetch latest weather conditions.</p>
                  <Button onClick={handleRefresh} disabled={generatingAI}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              ) : (
                weather.map((w) => (
                  <div key={w.id} className={`bg-card rounded-xl p-4 border ${
                    w.fog_risk || w.flood_risk ? "border-warning/50" : "border-border"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{w.location}</h3>
                      {(w.fog_risk || w.flood_risk) && (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                          Risk Alert
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span>{w.temperature}°C - {w.condition}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>Visibility: {w.visibility_km} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-muted-foreground" />
                        <span>Wind: {w.wind_speed_kmh} km/h</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {w.fog_risk && (
                          <Badge variant="outline" className="text-xs bg-warning/10 text-warning">
                            Fog Risk
                          </Badge>
                        )}
                        {w.flood_risk && (
                          <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive">
                            Flood Risk
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Action Logs Tab */}
          <TabsContent value="logs">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Action Logs
                </h2>
              </div>
              {actionLogs.length === 0 ? (
                <div className="p-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Action Logs</h3>
                  <p className="text-muted-foreground">Actions will be logged here as staff make decisions.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {actionLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{log.action_type}</Badge>
                          <p className="text-sm">{log.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modify Action Dialog */}
      <Dialog open={modifyDialogOpen} onOpenChange={setModifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify AI Action</DialogTitle>
            <DialogDescription>
              Edit the action description before approving. The original AI recommendation will be preserved.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium mb-2">{selectedAction?.title}</p>
            <Textarea
              value={modifiedDescription}
              onChange={(e) => setModifiedDescription(e.target.value)}
              placeholder="Enter modified action description..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleModifySubmit} disabled={actionLoading}>
              Save & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Send Announcement
            </DialogTitle>
            <DialogDescription>
              Broadcast a message to passengers and staff across all platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Audience</label>
              <Select value={announcementTarget} onValueChange={(v) => setAnnouncementTarget(v as "all" | "passengers" | "staff")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="passengers">Passengers Only</SelectItem>
                  <SelectItem value="staff">Staff Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                placeholder="Enter your announcement..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendAnnouncement} disabled={actionLoading || !newAnnouncement.trim()}>
              <Megaphone className="h-4 w-4 mr-2" />
              Send Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog with Countdown */}
      <ApprovalConfirmDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        actionTitle={pendingApprovalAction?.title || ""}
        onConfirm={handleConfirmApproval}
        countdownSeconds={10}
      />
    </div>
  );
};

export default AdminDashboard;
