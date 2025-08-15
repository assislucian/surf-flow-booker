import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight } from "lucide-react";
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

const Blog = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>{t("blog.title")} - Surfskate Hall Wiesbaden</title>
        <meta name="description" content={t("blog.subtitle") as string} />
        <link rel="canonical" href="/blog" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16 md:py-20">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-6 animate-fade-in">
            {t("blog.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            {t("blog.subtitle")}
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="container py-16 md:py-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-semibold mb-4">{t("blog.noPostsYet")}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("blog.subtitle")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover-scale transition-all duration-300 hover:shadow-elegant overflow-hidden">
                <Link to={`/blog/${post.slug}`}>
                  {post.image_url ? (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-primary flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">🏄‍♂️</div>
                        <p className="text-sm font-medium">Surfskate Hall</p>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <h2 className="font-semibold text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 transition-all">
                      <span>{t("blog.readMore")}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Blog;