
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Define the Client type based on your Supabase schema
interface Client {
  id: string;
  name: string;
  title?: string;
  description?: string;
  image_url?: string;
}

// Mock data since we don't have a clients table yet
const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    title: 'Wellness Program Participant',
    description: 'John has been part of our wellness program for 3 months and has seen significant improvements in his health metrics.',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Jane Smith',
    title: 'Caregiver Service User',
    description: 'Jane has been using our caregiving services for her mother and appreciates the quality of care provided.',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    title: 'Telehealth Patient',
    description: 'Robert regularly uses our telehealth services for his chronic condition management.',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const Clients = () => {
  // Using mock data for now until we create a clients table
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      // Return mock data for now
      return mockClients;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Clients</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read about the experiences of our valued clients who have benefited from our healthcare services.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <Skeleton className="h-12 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 mb-4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients?.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {client.image_url && (
                      <img 
                        src={client.image_url} 
                        alt={client.name} 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-xl">{client.name}</CardTitle>
                      <CardDescription>{client.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{client.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Read Full Story</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Clients;