#include <bits/stdc++.h>
typedef long long ll;
using namespace std;

const int mc=100;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n,q,c;cin>>n>>q>>c;
    int g[mc+1][mc+1][c+1];
    memset(g,0,sizeof(g));
    for (int i=0;i<n;i++){
        int x,y,s;cin>>x>>y>>s;
        for (int j=0;j<=c;j++){
            g[x][y][j]+=(s+j)%(c+1);
        }
    }
    for (int x=1;x<=mc;x++){
        for (int y=1;y<=mc;y++){
            for (int j=0;j<=c;j++){
                g[x][y][j]+=g[x-1][y][j]+g[x][y-1][j]-g[x-1][y-1][j];
            }
        }
    }
    while (q--){
        int x1,y1,x2,y2,t;cin>>t>>x1>>y1>>x2>>y2;
        t%=(c+1);
        cout<<g[x2][y2][t]-g[x1-1][y2][t]-g[x2][y1-1][t]+g[x1-1][y1-1][t]<<'\n';
    }
    return 0;
}