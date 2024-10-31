export interface PreviewPost {
    id: number;
    title: string;
    createdAt: string;
    tags: {name:string}[]; // Assuming tags are just names (strings)
    image: string;
}

export interface DetailedPost {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    tags: {name:string}[]; // Assuming tags are strings
    image: {url:string}[]; // URL of the image
    videos: {url:string}[];
}

export interface TagType {
    id: number;
    name: string;
}