import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, Calendar, Clock, ArrowLeft, Share2, Tag } from 'lucide-react';
import { BlogPost } from '../types/index.js';
import api from '../services/api.js';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/posts/${slug}`);
        if (res.data.success) {
          setPost(res.data.post);
          setRelatedPosts(res.data.relatedPosts || []);
        }
      } catch (err) {
        console.error('Failed to fetch blog post', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-24 text-slate-400 font-medium">Chargement de l'article...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-slate-400 text-lg">Article introuvable.</p>
        <Link to="/blog" className="btn-outline-gold px-6 py-2 text-xs uppercase">
          Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back button */}
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-gold-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux articles</span>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <span className="bg-gold-400/20 text-gold-300 border border-gold-400/40 text-xs font-bold uppercase px-4 py-1.5 rounded-full inline-block">
          {typeof post.categoryId === 'object' && post.categoryId ? post.categoryId.name : 'Communiqué Officiel'}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-400 border-y border-slate-800 py-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gold-400" />
            {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gold-400" />
            {post.readTimeMinutes} minutes de lecture
          </span>
          {post.authorId && (
            <>
              <span>•</span>
              <span className="font-semibold text-slate-300">
                Par {post.authorId.firstName} {post.authorId.lastName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Featured media */}
      {post.mediaType === 'VIDEO' ? (
        <div className="rounded-3xl overflow-hidden border-2 border-gold-400/30 shadow-gold-glow bg-dark-900">
          <video src={post.featuredImage} controls className="w-full max-h-[500px] object-cover" />
        </div>
      ) : post.mediaType === 'PDF' ? (
        <div className="rounded-3xl border-2 border-gold-400/30 bg-dark-900 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-300">Document PDF</p>
          <a href={post.featuredImage} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center btn-gold px-5 py-2 text-xs uppercase font-bold">
            Ouvrir le document
          </a>
        </div>
      ) : (
        <div className="rounded-3xl overflow-hidden border-2 border-gold-400/30 shadow-gold-glow max-h-[450px]">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Excerpt */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-gold-400 text-slate-200 text-base italic font-serif leading-relaxed">
        « {post.excerpt} »
      </div>

      {/* Rich Article Body */}
      <div
        className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 pt-6 border-t border-slate-800">
          <Tag className="w-4 h-4 text-gold-400" />
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="bg-dark-900 border border-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="pt-12 border-t border-slate-800 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-white">Articles Similaires</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel._id}
                to={`/blog/${rel.slug}`}
                className="glass-card rounded-2xl p-4 flex gap-4 items-center border border-slate-800 hover:border-gold-400/40 transition-colors group"
              >
                <img src={rel.featuredImage} alt={rel.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-white text-sm group-hover:text-gold-300 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(rel.publishedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
