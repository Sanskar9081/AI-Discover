import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">About AIDiscover</h1>
          <p className="text-muted-foreground mb-8">Learn more about our mission and vision</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p>
                AIDiscover is dedicated to democratizing access to artificial intelligence tools and resources. Our mission is to provide a comprehensive, searchable index of AI tools that empowers individuals and organizations to discover, compare, and implement the best AI solutions for their unique workflows.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Vision</h2>
              <p>
                We envision a world where AI technology is accessible to everyone, regardless of technical expertise. By curating and organizing the vast landscape of AI tools, we aim to bridge the gap between innovation and adoption, enabling users to make informed decisions about which tools best suit their needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
              <p className="mb-3">AIDiscover provides a comprehensive platform with the following features:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Extensive database of AI tools across multiple categories and use cases</li>
                <li>Detailed tool information including features, pricing, and user reviews</li>
                <li>Advanced comparison tools to help you evaluate multiple solutions side-by-side</li>
                <li>Curated prompts and best practices for maximum AI tool effectiveness</li>
                <li>AI Assistant to help you find the perfect tools for your specific needs</li>
                <li>Regular updates with the latest tools and innovations in the AI space</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
              <p className="mb-3">We are committed to the following core values:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Transparency:</strong> We provide honest, unbiased information about AI tools</li>
                <li><strong>Accessibility:</strong> Our platform is designed to be user-friendly for everyone</li>
                <li><strong>Innovation:</strong> We continuously evolve to stay ahead of the rapidly changing AI landscape</li>
                <li><strong>Community:</strong> We foster a vibrant community of AI enthusiasts and professionals</li>
                <li><strong>Quality:</strong> We maintain high standards for the tools and resources we feature</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Built for the AI Era</h2>
              <p>
                AIDiscover is built for the modern era where artificial intelligence is reshaping how we work, create, and solve problems. Whether you're a developer, designer, content creator, entrepreneur, or student, AIDiscover is your go-to resource for discovering the tools that will enhance your productivity and creativity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p>
                Have questions or suggestions? We'd love to hear from you. Get in touch at{" "}
                <a href="mailto:contact@aidiscover.app" className="text-accent hover:underline">
                  contact@aidiscover.app
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
