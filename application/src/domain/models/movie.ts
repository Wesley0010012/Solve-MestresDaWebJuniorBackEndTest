import { DirectorModel } from "./director";
import { DistributorModel } from "./distributor";
import { GenreModel } from "./genre";
import { MediaModel } from "./media";
import { ParentalRatingModel } from "./parental-rating";


export interface MovieModel {
  id: number,
  title: string,
  sinopsis: string,
  duration: TimeRanges,
  premiereDate: Date,
  genre: GenreModel,
  director: DirectorModel,
  parentalRating: ParentalRatingModel,
  media: MediaModel,
  distributor: DistributorModel
}