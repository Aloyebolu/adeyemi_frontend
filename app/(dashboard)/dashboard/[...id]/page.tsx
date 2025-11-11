// app/example/[id]/page.js

import { notFound } from 'next/navigation';

export default function Post({ params }) {
  // Logic to check if the requested resource is valid
  // if (params.id === 'invalid') {
    // This will render app/example/not-found.js
    notFound(); 
  // }

  return (
    <h1>Post {params.id}</h1>
  );
}
