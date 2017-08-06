import {parseBuffer} from "swf-parser";
import {Movie} from "swf-tree";

export async function getMovie(uri: string): Promise<Movie> {
  return new Promise<Movie>((resolve, reject) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (this: XMLHttpRequest, ev: Event): void {
      if (this.status === 200) {
        try {
          const movie: Movie = parseBuffer(this.response);
          resolve(movie);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error("Unknown error"));
      }
    };
    xhr.send();
  });
}
