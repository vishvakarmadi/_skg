import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { useUIStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useContactSubmit } from '@/hooks/useApi';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    titleHi: 'पता',
    content: '123 Temple Road, Varanasi, Uttar Pradesh 221001',
    contentHi: '१२३ मंदिर रोड, वाराणसी, उत्तर प्रदेश २२१००१',
  },
  {
    icon: Phone,
    title: 'Phone',
    titleHi: 'फोन',
    content: '+91 8800580015',
    contentHi: '+९१ ९८७६५ ४३२१०',
  },
  {
    icon: Mail,
    title: 'Email',
    titleHi: 'ईमेल',
    content: 'skgenterprise3@gmail.com',
    contentHi: 'skgenterprise3@gmail.com',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    titleHi: 'कार्य समय',
    content: 'Mon - Sat: 9:00 AM - 7:00 PM',
    contentHi: 'सोम - शनि: सुबह ९:०० - शाम ७:००',
  },
];

export function ContactSection() {
  const { mode } = useUIStore();
  const { t, isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '' as string,
    subject: '',
    message: '',
  });
  const { submit, loading: isSubmitting, success: submitted, error, resetSuccess } = useContactSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await submit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      type: formData.type,
      subject: formData.subject,
      message: formData.message,
    });
    if (ok) {
      setFormData({ name: '', email: '', phone: '', type: '', subject: '', message: '' });
      setTimeout(() => resetSuccess(), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className={cn(
      'py-20',
      isBhakti ? 'bg-sacred-gradient' : 'bg-steel-dark'
    )}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className={`inline-block px-4 py-1 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4 ${isHindi ? 'devanagari' : ''}`}>
            {t('contact.subtitle')}
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isHindi ? 'devanagari' : ''}`}>
            {isHindi ? 'हमसे ' : 'Contact '}
            <span className="text-gradient-saffron">
              {isHindi ? 'संपर्क करें' : 'Us'}
            </span>
          </h2>
          <p className={`text-muted-foreground max-w-2xl mx-auto ${isHindi ? 'devanagari' : ''}`}>
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
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
                    <h3 className={`font-semibold text-foreground mb-1 ${isHindi ? 'devanagari' : ''}`}>
                      {isHindi ? info.titleHi : info.title}
                    </h3>
                    <p className={`text-sm text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                      {isHindi ? info.contentHi : info.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isHindi ? info.content : info.contentHi}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              'lg:col-span-2 p-8 rounded-2xl',
              isBhakti
                ? 'bg-card shadow-diya'
                : 'bg-steel border border-copper/30'
            )}
          >
            <h3 className={`text-2xl font-bold mb-6 ${isHindi ? 'devanagari' : ''}`}>
              {t('contact.formTitle')}
            </h3>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✓</span>
                </div>
                <h4 className={`text-xl font-bold text-green-600 mb-2 ${isHindi ? 'devanagari' : ''}`}>
                  {isHindi ? 'धन्यवाद!' : 'Thank You!'}
                </h4>
                <p className={`text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                  {isHindi
                    ? 'आपका संदेश भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।'
                    : 'Your message has been sent. We will contact you soon.'
                  }
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isHindi ? 'devanagari' : ''}`}>
                      {t('contact.form.name')} <span className="text-saffron">*</span>
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
                        isBhakti
                          ? 'bg-muted border-border'
                          : 'bg-steel-dark border-copper/30 text-white'
                      )}
                      placeholder={isHindi ? 'आपका नाम' : 'Your Name'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isHindi ? 'devanagari' : ''}`}>
                      {t('contact.form.email')} <span className="text-saffron">*</span>
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
                        isBhakti
                          ? 'bg-muted border-border'
                          : 'bg-steel-dark border-copper/30 text-white'
                      )}
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isHindi ? 'devanagari' : ''}`}>
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl outline-none transition-all',
                        'border focus:ring-2 focus:ring-saffron/50',
                        isBhakti
                          ? 'bg-muted border-border'
                          : 'bg-steel-dark border-copper/30 text-white'
                      )}
                      placeholder="+91 8800580015"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isHindi ? 'devanagari' : ''}`}>
                      {isHindi ? 'पूछताछ प्रकार' : 'Inquiry Type'} <span className="text-saffron">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl outline-none transition-all',
                        'border focus:ring-2 focus:ring-saffron/50',
                        isBhakti
                          ? 'bg-muted border-border'
                          : 'bg-steel-dark border-copper/30 text-white'
                      )}
                    >
                      <option value="">{isHindi ? 'प्रकार चुनें' : 'Select Type'}</option>
                      <option value="general">{isHindi ? 'सामान्य पूछताछ' : 'General Inquiry'}</option>
                      <option value="order">{isHindi ? 'ऑर्डर संबंधी' : 'Order Related'}</option>
                      <option value="bulk">{isHindi ? 'थोक खरीद' : 'Bulk Purchase'}</option>
                      <option value="partnership">{isHindi ? 'साझेदारी' : 'Partnership'}</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isHindi ? 'devanagari' : ''}`}>
                    {t('contact.form.subject')} <span className="text-saffron">*</span>
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
                      isBhakti
                        ? 'bg-muted border-border'
                        : 'bg-steel-dark border-copper/30 text-white'
                    )}
                    placeholder={isHindi ? 'विषय लिखें' : 'Enter subject'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isHindi ? 'devanagari' : ''}`}>
                    {t('contact.form.message')} <span className="text-saffron">*</span>
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
                      isBhakti
                        ? 'bg-muted border-border'
                        : 'bg-steel-dark border-copper/30 text-white'
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
                  <span className={isHindi ? 'devanagari' : ''}>{t('contact.form.submit')}</span>
                </DiyaButton>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section >
  );
}
