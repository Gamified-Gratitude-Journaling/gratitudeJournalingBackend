#include <bits/stdc++.h>
typedef long long ll;
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n,M;cin>>n>>M;
    vector<int> cnt(101);
    int cs=0;
    for (int i=0;i<n;i++){
        int t;cin>>t;
        cs+=t;
        int res=0,d=max(0,cs-M);
        for (int j=100;j>0&&d>0;j--){
            int c=cnt[j];
            if (c*j<=d){
                res+=c;
                d-=c*j;
            } else{
                int req=(d-1)/j+1;
                res+=req;
                d-=req*j;
            }
        }
        cnt[t]++;
        cout<<res<<' ';
    }
    return 0;
}