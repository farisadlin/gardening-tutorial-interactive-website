import { useCurrentFrame } from 'remotion';
import type { FilmProps } from './PhotosynthesisFilm';
import { PhotosynthesisDayArtwork } from '../hyperframes/PhotosynthesisDayArtwork';

// Kept as the reference composition for migration comparisons.
export function PhotosynthesisDayFilm(props: FilmProps) {
  return <PhotosynthesisDayArtwork {...props} frame={useCurrentFrame()}/>;
}
