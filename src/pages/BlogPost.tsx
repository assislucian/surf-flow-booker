import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="aspect-video bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen">
        <div className="container py-20 text-center">
          <div className="text-6xl mb-6">📄</div>
          <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("blog.backToBlog")}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>{post.title} - Surfskate Hall Wiesbaden</title>
        <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
        <link rel="canonical" href={`/blog/${post.slug}`} />
      </Helmet>

      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("blog.backToBlog")}
            </Link>
          </Button>

          {/* Post Header */}
          <header className="mb-8 text-center">
            <Badge variant="secondary" className="mb-4">
              {t("blog.title")}
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{t("blog.publishedOn")} {formatDate(post.created_at)}</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.image_url && (
            <div className="aspect-video rounded-xl overflow-hidden shadow-elegant mb-8">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Post Content */}
          <article className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground">
              {post.content}
            </div>
          </article>

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t text-center">
            <Button asChild size="lg">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("blog.backToBlog")}
              </Link>
            </Button>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default BlogPost;