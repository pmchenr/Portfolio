import { useState } from "react";
import { useParams, Link } from "react-router-dom";
const Tabs = ({ children }) => <div>{children}</div>;
const TabsList = ({ children }) => <div>{children}</div>;
const TabsTrigger = ({ children, onClick }) => <button onClick={onClick}>{children}</button>;
const TabsContent = ({ children }) => <div>{children}</div>;

const Card = ({ children }) => <div className="border p-4 rounded">{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
import { Lock } from "lucide-react";

// Single-file scaffold for an individual Trip page with 3 tabs
// Route suggestion: <Route path="/trips/:slug" element={<TripPage />} />
export default function TripPage() {
  const { slug } = useParams();
  const tripName = formatTripName(slug);

  // TODO: Replace with real auth/subscription state
  const [isMember] = useState(false);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize">{tripName}</h1>
          <p className="text-sm opacity-70">/trips/{slug}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/trips">
            <Button variant="secondary">Back to trips</Button>
          </Link>
          {!isMember && (
            <Button>
              <Lock className="mr-2 h-4 w-4" /> Become a member
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full gap-2">
          <TabsTrigger className="flex-1" value="overview">Public Overview</TabsTrigger>
          <TabsTrigger className="flex-1" value="itinerary">Itinerary & Booking</TabsTrigger>
          <TabsTrigger className="flex-1" value="questions">Ask the Admins</TabsTrigger>
        </TabsList>

        {/* TAB 1: Public overview */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Trip Description</h2>
                <p className="leading-relaxed opacity-90">
                  Add your public-friendly description of the trip here. Hype, vibes, who it's for, best time to go, and what makes it unique.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Gallery</h2>
                <div className="grid grid-cols-3 gap-2">
                  {/* Replace placeholders with real images */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-video rounded-xl bg-muted" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: Members-only itinerary & booking */}
        <TabsContent value="itinerary" className="mt-6">
          {isMember ? (
            <div className="space-y-6">
              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">In-Depth Itinerary</h2>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Day 1 — Arrival & welcome dinner</li>
                    <li>Day 2 — Guided adventure</li>
                    <li>Day 3 — Free exploration</li>
                  </ol>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Booking</h2>
                  <Button>Start Booking</Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <LockedPanel label="Members-only itinerary & booking" />
          )}
        </TabsContent>

        {/* TAB 3: Members-only Q&A form */}
        <TabsContent value="questions" className="mt-6">
          {isMember ? (
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Ask the Admins</h2>
                <form className="space-y-4 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your question</label>
                    <textarea className="w-full rounded-xl border p-3" rows={5} placeholder="What's on your mind?" />
                  </div>
                  <Button type="button">Submit</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <LockedPanel label="Members-only Q&A" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function formatTripName(slug) {
  if (!slug) return "Trip";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function LockedPanel({ label }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6 flex items-start gap-4">
        <Lock className="h-5 w-5 mt-1" />
        <div>
          <h3 className="font-semibold">{label}</h3>
          <p className="text-sm opacity-80">
            This section is for paid members. Once you subscribe and sign in, you'll see the itinerary, booking, and the Q&A form.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
