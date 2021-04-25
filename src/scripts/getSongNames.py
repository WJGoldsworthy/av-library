import os

print(os.listdir('./public/assets/audio/'))

f = open('./src/data/songNames.js', 'w')
f.write('export default ["')
names = os.listdir('./public/assets/audio/')
f.write('","'.join(names))
f.write('"];')
f.close()