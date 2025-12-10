// src/pages/TripPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Pencil, Save, X, Eye, EyeOff } from "lucide-react";
import API from "../api";
import ImageUpload from "../components/ImageUpload";
import ImageLightbox from "../components/ImageLightbox";

export default function TripPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Check if user is admin (has token)
  const isAdmin = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/trips/${slug}`);
        setTrip(data);
        setEditData(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put(`/trips/${trip._id}`, editData);
      setTrip(data);
      setEditing(false);
      // If slug changed (title was edited), redirect to new URL
      if (data.slug && data.slug !== slug) {
        navigate(`/trips/${data.slug}`, { replace: true });
      }
    } catch (err) {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(trip);
    setEditing(false);
  };

  const handleTogglePublish = async () => {
    try {
      const { data } = await API.put(`/trips/${trip._id}`, {
        published: !trip.published
      });
      setTrip(data);
      setEditData(data);
    } catch (err) {
      alert("Failed to update publish status");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p>Loading trip...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-red-500">{error || "Trip not found"}</p>
        <Link to="/trips">
          <Button variant="secondary" className="mt-4">Back to trips</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Draft indicator */}
      {isAdmin && !trip.published && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg flex items-center justify-between">
          <span>This trip is a draft and not visible to the public.</span>
          <Button size="sm" onClick={handleTogglePublish}>
            <Eye className="mr-2 h-4 w-4" /> Publish
          </Button>
        </div>
      )}

      <header className="flex items-center justify-between mb-6">
        <div className="flex-1">
          {editing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.title || ""}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 outline-none w-full"
                placeholder="Trip Title"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  value={editData.location || ""}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  className="text-sm bg-transparent border-b border-gray-300 outline-none flex-1"
                  placeholder="Location (e.g. Lisbon, Portugal)"
                />
                <input
                  type="text"
                  value={editData.dates || ""}
                  onChange={(e) => setEditData({ ...editData, dates: e.target.value })}
                  className="text-sm bg-transparent border-b border-gray-300 outline-none w-32"
                  placeholder="Dates"
                />
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium mb-2">Cover Image (shown on trip cards)</label>
                <ImageUpload
                  images={editData.coverImage ? [editData.coverImage] : []}
                  onChange={(images) => setEditData({ ...editData, coverImage: images[0] || "" })}
                  multiple={false}
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{trip.title}</h1>
              <p className="text-sm opacity-70">{trip.location} {trip.dates && `• ${trip.dates}`}</p>
            </>
          )}
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link to="/trips">
            <Button variant="secondary">Back to trips</Button>
          </Link>
          {isAdmin && !editing && (
            <>
              <Button onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              {trip.published && (
                <Button variant="secondary" onClick={handleTogglePublish}>
                  <EyeOff className="mr-2 h-4 w-4" /> Unpublish
                </Button>
              )}
            </>
          )}
          {editing && (
            <>
              <Button variant="secondary" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save"}
              </Button>
            </>
          )}
          {!isAdmin && (
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
            <Card className="rounded-2xl h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Trip Description</h2>
                {editing ? (
                  <textarea
                    value={editData.summary || ""}
                    onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                    className="w-full flex-1 p-3 border rounded-lg min-h-[200px] resize-none"
                    placeholder="Describe this trip..."
                  />
                ) : (
                  <div className="leading-relaxed opacity-90 whitespace-pre-wrap flex-1">
                    {trip.summary || trip.content || "No description available."}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Gallery</h2>
                {editing ? (
                  <ImageUpload
                    images={editData.galleryImages || []}
                    onChange={(images) => setEditData({ ...editData, galleryImages: images })}
                    multiple={true}
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {trip.galleryImages && trip.galleryImages.length > 0 ? (
                      trip.galleryImages.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Gallery image ${i + 1}`}
                          className="aspect-video rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setLightboxIndex(i)}
                        />
                      ))
                    ) : (
                      <p className="col-span-3 text-sm opacity-60">No gallery images yet.</p>
                    )}
                  </div>
                )}

                {/* Lightbox */}
                {lightboxIndex !== null && trip.galleryImages && (
                  <ImageLightbox
                    images={trip.galleryImages}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNavigate={(index) => setLightboxIndex(index)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: Members-only itinerary & booking */}
        <TabsContent value="itinerary" className="mt-6">
          {isAdmin ? (
            <div className="space-y-6">
              {isAdmin && !editing && (
                <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                  You're viewing as admin. Regular users see this as locked.
                </p>
              )}
              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">In-Depth Itinerary</h2>
                  {editing ? (
                    <textarea
                      value={editData.itinerary || ""}
                      onChange={(e) => setEditData({ ...editData, itinerary: e.target.value })}
                      className="w-full p-3 border rounded-lg min-h-[200px]"
                      placeholder="Day 1: Arrival and welcome dinner&#10;Day 2: Morning tour...&#10;Day 3: Free exploration"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {trip.itinerary || "No itinerary added yet. Click Edit to add one."}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Booking Information</h2>
                  {editing ? (
                    <textarea
                      value={editData.bookingInfo || ""}
                      onChange={(e) => setEditData({ ...editData, bookingInfo: e.target.value })}
                      className="w-full p-3 border rounded-lg min-h-[150px]"
                      placeholder="Price: $X,XXX per person&#10;Includes: Flights, hotels, tours...&#10;How to book: Contact us at..."
                    />
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {trip.bookingInfo || "No booking info added yet. Click Edit to add."}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <LockedPanel label="Members-only itinerary & booking" />
          )}
        </TabsContent>

        {/* TAB 3: Members-only Q&A */}
        <TabsContent value="questions" className="mt-6">
          {isAdmin ? (
            <QASection tripId={trip._id} isAdmin={isAdmin} />
          ) : (
            <LockedPanel label="Members-only Q&A" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
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

function QASection({ tripId, isAdmin }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [tripId]);

  const fetchQuestions = async () => {
    try {
      const { data } = await API.get(`/questions/${tripId}`);
      setQuestions(data);
    } catch (err) {
      console.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await API.post("/questions", {
        tripId,
        question: newQuestion,
        askedBy: isAdmin ? "Admin" : "Member"
      });
      setQuestions([data, ...questions]);
      setNewQuestion("");
    } catch (err) {
      alert("Failed to submit question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    if (!answerText.trim()) return;

    try {
      const { data } = await API.put(`/questions/${questionId}/answer`, {
        answer: answerText
      });
      setQuestions(questions.map(q => q._id === questionId ? data : q));
      setAnsweringId(null);
      setAnswerText("");
    } catch (err) {
      alert("Failed to submit answer");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Delete this question?")) return;

    try {
      await API.delete(`/questions/${questionId}`);
      setQuestions(questions.filter(q => q._id !== questionId));
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
          You're viewing as admin. You can answer questions below.
        </p>
      )}

      {/* Ask a Question Form */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
              placeholder="What would you like to know about this trip?"
            />
            <Button type="submit" disabled={submitting || !newQuestion.trim()}>
              {submitting ? "Submitting..." : "Submit Question"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Questions & Answers ({questions.length})
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-gray-500">No questions yet. Be the first to ask!</p>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q._id} className="border-b pb-4 last:border-0">
                  {/* Question */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{q.question}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Asked by {q.askedBy} • {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Answer */}
                  {q.answer ? (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-blue-200 bg-blue-50 p-3 rounded-r-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">{q.answer}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Answered by {q.answeredBy} • {new Date(q.answeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : isAdmin ? (
                    <div className="mt-3 ml-4">
                      {answeringId === q._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="w-full p-2 border rounded-lg min-h-[80px] resize-none text-sm"
                            placeholder="Write your answer..."
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSubmitAnswer(q._id)}>
                              Submit Answer
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setAnsweringId(null);
                                setAnswerText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAnsweringId(q._id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          + Add Answer
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 ml-4 text-sm text-gray-500 italic">
                      Awaiting response from admin...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
