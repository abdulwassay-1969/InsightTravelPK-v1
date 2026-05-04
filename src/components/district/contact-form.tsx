'use client';

import { useState } from 'react';
import { Mail, Send, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ContactFormProps = {
    districtName: string;
};

export default function ContactForm({ districtName }: ContactFormProps) {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <section className="py-12 border-t border-border">
            <div className="flex items-center gap-3 mb-2">
                <Mail className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Contact & Inquiries</h2>
            </div>
            <p className="text-muted-foreground mb-8">
                Have a question about visiting {districtName}? We're here to help!
            </p>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                        <h3 className="font-semibold text-foreground mb-4">Get in Touch</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Location</p>
                                    <p className="text-sm text-muted-foreground">{districtName}, Pakistan</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">info@insighttravelpk.pk</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <p className="text-sm text-muted-foreground">+92 51 111 000 111</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/10 rounded-2xl p-5 border border-accent/20">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            🕐 <strong>Response Time:</strong> We typically respond within 24 hours. For urgent travel inquiries,
                            please call us directly.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div>
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12 bg-green-50 rounded-2xl border border-green-200">
                            <div className="text-4xl mb-3">✅</div>
                            <h3 className="text-lg font-semibold text-green-800 mb-1">Thanks! Form preview submitted.</h3>
                            <p className="text-sm text-green-700">
                                This is a demo form in the current build and does not send to support yet.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4 border-green-400 text-green-700 hover:bg-green-100"
                                onClick={() => setSubmitted(false)}
                            >
                                Fill Again
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Name *</label>
                                    <Input
                                        name="name"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Email *</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="you@email.com"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Subject</label>
                                <Input
                                    name="subject"
                                    placeholder={`Inquiry about ${districtName}`}
                                    value={form.subject}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Message *</label>
                                <Textarea
                                    name="message"
                                    placeholder="How can we help you?"
                                    rows={4}
                                    value={form.message}
                                    onChange={handleChange}
                                    className="resize-none"
                                />
                            </div>
                            {error && <p className="text-destructive text-sm">{error}</p>}
                            <Button type="submit" className="w-full gap-2">
                                <Send className="w-4 h-4" />
                                Send Message
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
