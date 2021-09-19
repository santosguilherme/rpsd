export default function compose(...args) {
    return argument => args.reduceRight((result, fn) => fn(result), argument);
}
