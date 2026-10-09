import { Composition, registerRoot } from 'remotion';
import { PhotosynthesisFilm, filmTiming } from './PhotosynthesisFilm';
import { PhotosynthesisDayFilm } from './PhotosynthesisDayFilm';
import { dayTiming } from '../data/photosynthesisDay';
function Root() {
  return <>{(['en', 'id'] as const).flatMap(language => (['soil', 'hydro'] as const).map(method => <Composition key={`${language}-${method}`} id={`Photosynthesis-${method}-${language}`} component={PhotosynthesisFilm} durationInFrames={filmTiming.durationInFrames} fps={filmTiming.fps} width={filmTiming.width} height={filmTiming.height} defaultProps={{ language, method }}/>))}{(['en', 'id'] as const).flatMap(language => (['soil', 'hydro'] as const).map(method => <Composition key={`day-${language}-${method}`} id={`PhotosynthesisDay-${method}-${language}`} component={PhotosynthesisDayFilm} durationInFrames={dayTiming.durationInFrames} fps={dayTiming.fps} width={dayTiming.width} height={dayTiming.height} defaultProps={{ language, method }}/>))}</>;
}
registerRoot(Root);
