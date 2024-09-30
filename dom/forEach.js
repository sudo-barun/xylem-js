import ForEachBlockBuilder from "./_internal/ForEachBlockBuilder.js";
export default function forEach(array, build) {
    return new ForEachBlockBuilder(array, build);
}
