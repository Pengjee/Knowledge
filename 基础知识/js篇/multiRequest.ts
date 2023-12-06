export const multiRequest = (urls: string[], maxNum: number) => {

}

const loadImg = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            console.log(url, "加载完成");
            resolve(img);
        };
        img.onerror = function() {
            reject(new Error('Error at:' + url));
        };
        img.src = url;
    })
}