import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUIStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { cn } from '@/lib/utils';

const contactInfo = [
  {
    icon: MapPin,
    titleEn: 'Address',
    titleHi: 'पता',
    content: '123 Temple Road, Varanasi, Uttar Pradesh 221001',
    contentHi: '१२३ मंदिर रोड, वाराणसी, उत्तर प्रदेश २२१००१',
  },
  {
    icon: Phone,
    titleEn: 'Phone',
    titleHi: 'फोन',
    content: '+91 8800580015',
    contentHi: '+९१ ९८७६५ ४३२१०',
  },
  {
    icon: Mail,
    titleEn: 'Email',
    titleHi: 'ईमेल',
    content: 'skgenterprise3@gmail.com',
    contentHi: 'skgenterprise3@gmail.com',
  },
  {
    icon: Clock,
    titleEn: 'Working Hours',
    titleHi: 'कार्य समय',
    content: 'Mon - Sat: 9:00 AM - 7:00 PM',
    contentHi: 'सोम - शनि: सुबह ९:०० - शाम ७:००',
  },
];

export function ContactPage() {
  const { mode } = useUIStore();
  const { t, isHindi } = useLanguage();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isBhakti = mode === 'bhakti';

  // Handle URL params for pre-filling subject
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setFormData(prev => ({ ...prev, subject: subjectParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={cn('min-h-screen pt-20', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
      {/* Header */}
      <div className={cn('py-12', isBhakti ? 'bg-sacred-gradient' : 'bg-steel')}>
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.titleEn}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-5 rounded-xl transition-all duration-300',
                  isBhakti
                    ? 'bg-card shadow-diya hover:shadow-diya-hover'
                    : 'bg-steel border border-copper/30 hover:border-copper'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                    'bg-saffron/10 text-saffron'
                  )}>
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {isHindi ? info.titleHi : info.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isHindi ? info.contentHi : info.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cn(
                'aspect-video rounded-xl overflow-hidden',
                isBhakti ? 'bg-muted' : 'bg-steel border border-copper/30'
              )}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.0123456789012!2d83.0101!3d25.3176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE5JzAzLjQiTiA4M8KwMDAnMzYuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SKG Enterprise Location"
              />
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'lg:col-span-2 p-8 rounded-2xl',
              isBhakti ? 'bg-card shadow-diya' : 'bg-steel border border-copper/30'
            )}
          >
            <h2 className="text-2xl font-bold mb-6">
              {isHindi ? 'संदेश भेजें' : 'Send Message'}
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  {isHindi ? 'धन्यवाद!' : 'Thank You!'}
                </h3>
                <p className="text-muted-foreground">
                  {t('contact.success')}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.name')} <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl outline-none transition-all',
                        'border focus:ring-2 focus:ring-saffron/50',
                        isBhakti ? 'bg-muted border-border' : 'bg-steel-dark border-copper/30 text-white'
                      )}
                      placeholder={isHindi ? 'आपका नाम' : 'Your name'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.email')} <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl outline-none transition-all',
                        'border focus:ring-2 focus:ring-saffron/50',
                        isBhakti ? 'bg-muted border-border' : 'bg-steel-dark border-copper/30 text-white'
                      )}
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl outline-none transition-all',
                        'border focus:ring-2 focus:ring-saffron/50',
                        isBhakti ? 'bg-muted border-border' : 'bg-steel-dark border-copper/30 text-white'
                      )}
                      placeholder="+91 8800580015"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.subject')} <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl outline-none transition-all',
                        'border focus:ring-2 focus:ring-saffron/50',
                        isBhakti ? 'bg-muted border-border' : 'bg-steel-dark border-copper/30 text-white'
                      )}
                      placeholder={isHindi ? 'विषय' : 'Subject'}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.message')} <span className="text-saffron">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl outline-none transition-all resize-none',
                      'border focus:ring-2 focus:ring-saffron/50',
                      isBhakti ? 'bg-muted border-border' : 'bg-steel-dark border-copper/30 text-white'
                    )}
                    placeholder={isHindi ? 'अपना संदेश यहां लिखें...' : 'Write your message here...'}
                  />
                </div>

                {/* Submit Button */}
                <DiyaButton
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  loading={isSubmitting}
                  icon={<Send className="w-5 h-5" />}
                >
                  {t('contact.send')}
                </DiyaButton>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
