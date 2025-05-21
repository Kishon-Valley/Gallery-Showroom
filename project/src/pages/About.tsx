import { motion } from 'framer-motion';
import authorImage from '../img/Author.jpg';

export const About = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gray-50 py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={authorImage}
                  alt="Portrait of the Artist"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-black/5 rounded-2xl -z-10" />
            </motion.div>

            {/* Text Column */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                About Me
              </h1>
              <p className="text-xl text-gray-600">
                Hello! I'm AJ Borges, a passionate artist from Brasil, bringing vibrant South American influences to my creative expressions.
              </p>
              <p className="text-gray-600">
                My journey in art began in the colorful streets of Brasil, where I was surrounded by rich cultural heritage and diverse artistic traditions. Now, I channel these influences into my paintings, creating pieces that bridge cultures and emotions. My work is deeply influenced by both my Brazilian roots and contemporary artistic movements.
              </p>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">My Approach</h2>
                <p className="text-gray-600">
                  I believe in the power of color and emotion in painting. Each piece I create is a conversation between traditional Brazilian artistic elements and modern expressions. I work primarily with acrylics and oils, focusing on creating pieces that not only capture the eye but also touch the soul. My process involves layers of meaning, each brushstroke telling part of a larger story.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Additional Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Education */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gray-50 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-4">Education</h3>
              <ul className="space-y-2 text-gray-600">
                {/* Add your education details */}
                <li>Your Degree</li>
                <li>Your Certifications</li>
              </ul>
            </motion.div>

            {/* Exhibitions */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-gray-50 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-4">Exhibitions</h3>
              <ul className="space-y-2 text-gray-600">
                {/* Add your exhibitions */}
                <li>Exhibition Name, Year</li>
                <li>Exhibition Name, Year</li>
              </ul>
            </motion.div>

            {/* Awards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gray-50 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-4">Awards</h3>
              <ul className="space-y-2 text-gray-600">
                {/* Add your awards */}
                <li>Award Name, Year</li>
                <li>Award Name, Year</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}; 