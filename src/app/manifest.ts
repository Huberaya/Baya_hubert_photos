import type { MetadataRoute } from 'next';
export default function manifest():MetadataRoute.Manifest{return {name:'Hubert Baya — Photographe',short_name:'Hubert Baya',description:'Portfolio de Hubert Baya, photographe à Paris.',start_url:'/',display:'standalone',background_color:'#050505',theme_color:'#050505',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml'}]}}
