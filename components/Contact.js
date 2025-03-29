"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      if (!executeRecaptcha) {
        toast({
          title: 'Error',
          description: 'reCAPTCHA not available. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      try {
        const recaptchaToken = await executeRecaptcha('contact_form');
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, recaptchaToken }),
        });

        if (!response.ok) throw new Error('Failed to send email');

        toast({
          title: 'Success!',
          description: 'Your message has been sent successfully.',
          variant: 'default',
        });
        setFormData({ name: '', mobile: '', email: '', message: '' });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to send your message. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [executeRecaptcha, formData]
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about pharmacy studies or want to collaborate? Reach out today!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border-muted focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Your Mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    className="w-full border-muted focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full border-muted focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full min-h-[150px] border-muted focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Basara Fatehpur Barabanki, Uttar Pradesh
                  <br />
                  Barabanki, Uttar Pradesh 225305
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <a href="mailto:farmankhan12ab@gmail.com" className="hover:text-primary transition-colors">
                    farmankhan12ab@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Phone className="h-5 w-5" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">+91 (734) 815-8118</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}