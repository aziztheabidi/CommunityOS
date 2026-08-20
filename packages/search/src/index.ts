import type { ActorContext } from "@communityos/types";

export type SearchEntityType =
  | "resident"
  | "profession"
  | "skill"
  | "business"
  | "group"
  | "event"
  | "opportunity"
  | "amenity"
  | "post";

export interface SearchDocument {
  id: string;
  societyId: string;
  entityType: SearchEntityType;
  title: string;
  subtitle?: string;
  visibility: string;
  payload?: Record<string, unknown>;
}

export interface SearchQuery {
  q: string;
  entityTypes?: SearchEntityType[];
  limit?: number;
}

export interface SearchHit {
  document: SearchDocument;
  score: number;
}

export interface CommunitySearch {
  index(doc: SearchDocument): Promise<void>;
  remove(id: string): Promise<void>;
  query(q: SearchQuery, viewer: ActorContext): Promise<SearchHit[]>;
}

/** In-memory stub for Milestone 0; replaced by Postgres FTS in later milestones. */
export class MemorySearchProvider implements CommunitySearch {
  private docs = new Map<string, SearchDocument>();

  async index(doc: SearchDocument): Promise<void> {
    this.docs.set(doc.id, doc);
  }

  async remove(id: string): Promise<void> {
    this.docs.delete(id);
  }

  async query(q: SearchQuery, viewer: ActorContext): Promise<SearchHit[]> {
    const needle = q.q.trim().toLowerCase();
    if (!needle) return [];

    return [...this.docs.values()]
      .filter((doc) => doc.societyId === viewer.societyId)
      .filter((doc) => !q.entityTypes || q.entityTypes.includes(doc.entityType))
      .filter((doc) => doc.title.toLowerCase().includes(needle))
      .slice(0, q.limit ?? 20)
      .map((document) => ({ document, score: 1 }));
  }
}
