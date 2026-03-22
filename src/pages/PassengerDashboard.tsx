import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Train, 
  Search, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowRight,
  RefreshCw,
  LogOut,
  CheckCircle,
  CloudRain,
  Phone,
  MessageSquare,
  HelpCircle,
  Bell,
  FileText,
  Navigation,
  Star,
  Calendar,
  Megaphone,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRailwayData, Train as TrainType, Alert, Announcement } from "@/hooks/useRailwayData";

interface PNRInfo {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  from: string;
  to: string;
  classType: string;
  passengerStatus: "CNF" | "RAC" | "WL";
  seatNumber?: string;
  chartStatus: "Prepared" | "Not Prepared";
}

// Only train-based alternatives (no buses or road transport)
const alternateOptions = [
  {
    type: "train",
    name: "Poorva Express (12381)",
    departure: "18:30",
    arrival: "Next day 07:15",
    note: "Available seats in Sleeper and 3AC",
  },
  {
    type: "train",
    name: "Vikramshila Express (12368)",
    departure: "19:15",
    arrival: "Next day 08:45",
    note: "Running on time",
  },
  {
    type: "train",
    name: "Sampoorn Kranti Express (12393)",
    departure: "20:00",
    arrival: "Next day 09:30",
    note: "Superfast train with good connectivity",
  },
];

const helpCategories = [
  { icon: Phone, title: "Railway Helpline", value: "139", description: "24x7 Railway Enquiry" },
  { icon: AlertTriangle, title: "Security Helpline", value: "182", description: "Railway Protection Force" },
  { icon: HelpCircle, title: "Complaint", value: "138", description: "Complaint Registration" },
];

const PassengerDashboard = () => {
  const { trains, alerts, announcements, loading, refetch } = useRailwayData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrain, setSelectedTrain] = useState<TrainType | null>(null);
  const [searchType, setSearchType] = useState<"number" | "route" | "pnr">("number");
  const [pnrQuery, setPnrQuery] = useState("");
  const [pnrInfo, setPnrInfo] = useState<PNRInfo | null>(null);
  const [showPnrResult, setShowPnrResult] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  // Auto-select first delayed train for demo purposes
  useEffect(() => {
    if (trains.length > 0 && !selectedTrain) {
      const delayedTrain = trains.find(t => t.status === "delayed") || trains[0];
      setSelectedTrain(delayedTrain);
    }
  }, [trains, selectedTrain]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundTrain = trains.find(t => 
      t.train_number.includes(searchQuery) || 
      t.train_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (foundTrain) {
      setSelectedTrain(foundTrain);
      toast({
        title: "Train Found",
        description: `Showing status for Train ${foundTrain.train_number}`,
      });
    } else {
      toast({
        title: "Train Not Found",
        description: "No train matches your search. Try a different number.",
        variant: "destructive",
      });
    }
  };

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrQuery.length === 10) {
      // Mock PNR data using real train if available
      const train = trains[0];
      setPnrInfo({
        pnrNumber: pnrQuery,
        trainNumber: train?.train_number || "12345",
        trainName: train?.train_name || "Express Train",
        journeyDate: "25 Jan 2026",
        from: train?.origin || "Origin",
        to: train?.destination || "Destination",
        classType: "3A",
        passengerStatus: "CNF",
        seatNumber: "B2-45",
        chartStatus: "Prepared",
      });
      setShowPnrResult(true);
      toast({
        title: "PNR Status Found",
        description: `Booking status for PNR ${pnrQuery}`,
      });
    } else {
      toast({
        title: "Invalid PNR",
        description: "Please enter a valid 10-digit PNR number",
        variant: "destructive",
      });
    }
  };

  const handleEnableNotifications = () => {
    setNotifyEnabled(true);
    toast({
      title: "Notifications Enabled",
      description: `You will receive updates for Train ${selectedTrain?.train_number}`,
    });
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim() && rating > 0) {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      setFeedbackDialogOpen(false);
      setFeedback("");
      setRating(0);
    }
  };

  // Get active announcements for passengers
  const passengerAnnouncements = announcements.filter(
    a => a.target_audience === "all" || a.target_audience === "passengers"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading train information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
              <Train className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Rail Disruption Co-pilot</h1>
              <p className="text-xs text-primary-foreground/70">Passenger Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setFeedbackDialogOpen(true)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Announcements Banner */}
      {passengerAnnouncements.length > 0 && (
        <div className="bg-accent/10 border-b border-accent/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-start gap-3">
              <Megaphone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="space-y-2">
                {passengerAnnouncements.slice(0, 2).map((announcement) => (
                  <div key={announcement.id} className="text-sm">
                    <span className="font-medium">{announcement.title}:</span>{" "}
                    <span className="text-muted-foreground">{announcement.content}</span>
                    {announcement.is_ai_generated && (
                      <Badge variant="outline" className="ml-2 text-xs">AI Generated</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Section */}
      {alerts.filter(a => a.severity === "critical").length > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="container mx-auto px-4 py-3">
            {alerts.filter(a => a.severity === "critical").map((alert) => (
              <div key={alert.id} className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Your Train
          </h2>
          
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as "number" | "route" | "pnr")}>
            <TabsList className="mb-4">
              <TabsTrigger value="number">By Train Number</TabsTrigger>
              <TabsTrigger value="route">By Station</TabsTrigger>
              <TabsTrigger value="pnr">PNR Status</TabsTrigger>
            </TabsList>

            <TabsContent value="number">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter train number (e.g., 12301)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="railway">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="route">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label className="sr-only">From Station</Label>
                  <Input placeholder="From station (e.g., New Delhi)" />
                </div>
                <div className="flex-1">
                  <Label className="sr-only">To Station</Label>
                  <Input placeholder="To station (e.g., Mumbai)" />
                </div>
                <Button type="submit" variant="railway">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="pnr">
              <form onSubmit={handlePnrSearch} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter 10-digit PNR number"
                    value={pnrQuery}
                    onChange={(e) => setPnrQuery(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                  />
                </div>
                <Button type="submit" variant="railway">
                  <FileText className="h-4 w-4 mr-2" />
                  Check Status
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* PNR Result */}
        {showPnrResult && pnrInfo && searchType === "pnr" && (
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                PNR Status
              </h3>
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                {pnrInfo.chartStatus}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">PNR Number</p>
                <p className="font-semibold">{pnrInfo.pnrNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Train</p>
                <p className="font-semibold">{pnrInfo.trainNumber} - {pnrInfo.trainName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Journey Date</p>
                <p className="font-semibold flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {pnrInfo.journeyDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold">{pnrInfo.from} → {pnrInfo.to}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{pnrInfo.classType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booking Status</p>
                <p className="font-semibold">
                  <Badge className={`${
                    pnrInfo.passengerStatus === "CNF" ? "bg-success" : 
                    pnrInfo.passengerStatus === "RAC" ? "bg-warning" : "bg-destructive"
                  } text-white`}>
                    {pnrInfo.passengerStatus} {pnrInfo.seatNumber && `- ${pnrInfo.seatNumber}`}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Train Status Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Train Status */}
            {selectedTrain && searchType !== "pnr" && (
              <div className={`bg-card rounded-xl shadow-sm border p-6 ${
                selectedTrain.status === "delayed" ? "border-destructive/30" : "border-border"
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Train className="h-5 w-5 text-primary" />
                      <span className="font-bold text-lg">{selectedTrain.train_number}</span>
                      <Badge className={
                        selectedTrain.status === "on_time" ? "bg-success text-white" : 
                        selectedTrain.status === "delayed" ? "bg-destructive text-white" :
                        "bg-warning text-warning-foreground"
                      }>
                        {selectedTrain.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold">{selectedTrain.train_name}</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedTrain.origin}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                  <span>{selectedTrain.destination}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled Departure</p>
                    <p className="font-semibold text-lg">
                      {selectedTrain.scheduled_departure 
                        ? new Date(selectedTrain.scheduled_departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Arrival</p>
                    <p className={`font-semibold text-lg ${
                      selectedTrain.status === "delayed" ? "text-destructive" : "text-success"
                    }`}>
                      {selectedTrain.expected_arrival 
                        ? new Date(selectedTrain.expected_arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "On schedule"}
                    </p>
                  </div>
                </div>

                {/* Live Location Info */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 mb-4">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-primary" />
                    Live Location
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Location</p>
                      <p className="font-medium">{selectedTrain.current_location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Station</p>
                      <p className="font-medium">{selectedTrain.last_station || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Station</p>
                      <p className="font-medium">{selectedTrain.next_station || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Speed</p>
                      <p className="font-medium">{selectedTrain.speed_kmh ? `${selectedTrain.speed_kmh} km/h` : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Platform</p>
                      <p className="font-medium">{selectedTrain.platform || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Zone</p>
                      <p className="font-medium">{selectedTrain.zone || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {selectedTrain.delay_minutes > 0 && (
                  <div className="flex items-center gap-2 text-destructive font-medium mb-4">
                    <Clock className="h-4 w-4" />
                    Delayed by {selectedTrain.delay_minutes} minutes
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  {selectedTrain.platform && (
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                      Platform: {selectedTrain.platform}
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEnableNotifications}
                    disabled={notifyEnabled}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {notifyEnabled ? "Notifications Enabled" : "Get Updates"}
                  </Button>
                </div>
              </div>
            )}

            {/* Disruption Alert */}
            {selectedTrain?.status === "delayed" && searchType !== "pnr" && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-destructive/10 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-destructive mb-2">
                      Disruption Alert
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This train is currently experiencing delays. Please check the live status for updates.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <CloudRain className="h-4 w-4 text-muted-foreground" />
                      <span>Delay may be due to weather or operational reasons</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alternate Travel Options */}
            {selectedTrain?.status === "delayed" && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  Alternate Travel Options
                </h3>
                <div className="space-y-3">
                  {alternateOptions.map((option, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Train className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">{option.note}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{option.departure}</p>
                        <p className="text-sm text-muted-foreground">{option.arrival}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* All Trains Quick View */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Train className="h-5 w-5 text-primary" />
                Live Train Status
              </h3>
              <div className="space-y-3">
                {trains.slice(0, 5).map((train) => (
                  <div 
                    key={train.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTrain?.id === train.id 
                        ? "bg-primary/10 border border-primary/30" 
                        : "bg-secondary/50 hover:bg-secondary"
                    }`}
                    onClick={() => setSelectedTrain(train)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{train.train_number}</span>
                      <Badge className={
                        train.status === "on_time" ? "bg-success text-white text-xs" : 
                        "bg-destructive text-white text-xs"
                      }>
                        {train.delay_minutes > 0 ? `+${train.delay_minutes}m` : "On time"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{train.train_name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Alerts */}
            {alerts.length > 0 && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Active Alerts
                </h3>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-3 rounded-lg ${
                        alert.severity === "critical" 
                          ? "bg-destructive/10 border border-destructive/20" 
                          : "bg-warning/10 border border-warning/20"
                      }`}
                    >
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Railway Helplines */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Railway Helplines
              </h3>
              <div className="space-y-3">
                {helpCategories.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <a 
                      href={`tel:${item.value}`}
                      className="text-primary font-bold text-lg hover:underline"
                    >
                      {item.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Travel Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Arrive at the station 30 minutes before departure
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Keep your PNR and ID ready for TTE verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Enable notifications for real-time updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Check platform number before boarding
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              Help us improve your travel experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        star <= rating 
                          ? "text-warning fill-warning" 
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Feedback</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Tell us about your experience..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={!feedback.trim() || rating === 0}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PassengerDashboard;
