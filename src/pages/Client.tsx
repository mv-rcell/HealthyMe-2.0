import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample client data
const clientsData = [
  {
    id: "1",
    name: "Emma Wainaina",
    title: "Active Member",
    description: "Looking for support with anxiety management and stress reduction techniques for a high-pressure work environment.",
    imageUrl: "https://images.unsplash.com/photo-1727791719116-39761d569f32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGhvdG9zJTIwb2YlMjBibGFjayUyMCUyMHdvbWVufGVufDB8fDB8fHww",
    isSpecialist: false
  },
  {
    id: "2",
    name: "David Muchira",
    title: "New Member",
    description: "Recovering from a sports injury and seeking physical therapy and a personalized exercise regimen to regain strength.",
    imageUrl: "https://media.istockphoto.com/id/1011883798/photo/portrait-of-a-smiling-guy.webp?a=1&b=1&s=612x612&w=0&k=20&c=tilJL4bB6BrOoc4X4JOM5_elUX_wFFM9qptuBHLzdWM=",
    isSpecialist: false
  },
  {
    id: "3",
    name: "Sophia Musia",
    title: "Premium Member",
    description: "Interested in nutritional counseling for weight management and implementing sustainable healthy eating habits.",
    imageUrl: "https://images.unsplash.com/photo-1645736353780-e70a7d508088?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhvdG9zJTIwb2YlMjBibGFjayUyMCUyMHdvbWVufGVufDB8fDB8fHww",
    isSpecialist: false
  },
  {
    id: "4",
    name: "Jason Lenana",
    title: "Active Member",
    description: "Working on preventive health strategies and looking for guidance on maintaining overall wellness as he enters his 40s.",
    imageUrl: "https://images.unsplash.com/photo-1630838030426-4c10dc37cf53?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBob3RvcyUyMG9mJTIwYmxhY2slMjAlMjBtZW58ZW58MHx8MHx8fDA%3D",
    isSpecialist: false
  },
  {
    id: "5",
    name: "Olivia Johnson",
    title: "Premium Member",
    description: "Seeking family therapy to improve communication with teenage children and create a more harmonious home environment.",
    imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1372&auto=format&fit=crop",
    isSpecialist: false
  }
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter clients based on search term
  const filteredClients = clientsData.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
 



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Clients</h1>
          <p className="text-muted-foreground mb-8">
            View and manage your client relationships and connect with them directly.
          </p>
          
          {/* Search section */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Clients grid */}
          {filteredClients.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <ProfileCard 
                  key={client.id}
                  {...client}
                  id={client.id}
                  name={client.name}
                  title={client.title || "Active Member"}
                  description={client.description || "No description available"}
                  imageUrl={client.image_url}
                  isSpecialist={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No clients found matching your search.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Clients;