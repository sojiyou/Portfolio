import { useState } from "react";
import emailjs from "@emailjs/browser";
import useInView from "../hooks/useInView";
import "./Contact.css";

export default function Contact() {
  const [ref, inView] = useInView(0.1);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          time: new Date().toLocaleString("en-PH", {
            dateStyle: "long",
            timeStyle: "short",
          }),
        },
        { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY },
      );
      setStatus("sent");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("idle");
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="section section--contact" ref={ref}>
      <div className={`section__inner ${inView ? "fade-in" : ""}`}>
        <div className="section__header">
          <span className="section__label">Let's Talk</span>
          <h2 className="section__title">Get in Touch</h2>
        </div>

        <div className="contact__layout">
          <div className="contact__left">
            <p className="contact__intro">
              Whether you have a project in mind, a question, or just want to
              say hello — I'm always open to a good conversation.
            </p>
            <div className="contact__info">
              <div className="contact__info-item">
                <span className="contact__info-label">Location</span>
                <span className="contact__info-value">
                  Baguio City, Philippines
                </span>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-label">Education</span>
                <span className="contact__info-value">
                  University of the Cordilleras
                </span>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-label">Focus</span>
                <span className="contact__info-value">
                  Frontend Development
                </span>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            {status === "sent" ? (
              <div className="contact__success">
                <span className="contact__success-icon">✓</span>
                <p>Message sent! I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="contact__field">
                  <label className="contact__label">Name</label>
                  <input
                    className="contact__input"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Email</label>
                  <input
                    className="contact__input"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Message</label>
                  <textarea
                    className="contact__input contact__textarea"
                    name="message"
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn--primary btn--full ${status === "sending" ? "btn--loading" : ""}`}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
