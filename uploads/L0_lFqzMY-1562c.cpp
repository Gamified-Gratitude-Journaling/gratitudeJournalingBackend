#include <bits/stdc++.h>
typedef long long ll;
using namespace std;

vector<int> solve(){
    int n; string s;cin>>n>>s;
    for (int i=0;i<n;i++){
        if (s[i]=='0'){
            if (i<n/2){
                return {i+1,n,i+2,n};
            } else{
                return {1,i+1,1,i};
            }
        }
    }
    return {1,n-1,2,n};
}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t;cin>>t;
    while (t--){
        auto res=solve();
        for (int i: res) cout<<i<<' ';
        cout<<'\n';
    }
    return 0;
}