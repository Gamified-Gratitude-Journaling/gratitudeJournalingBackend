#include <bits/stdc++.h>
typedef long long ll;
using namespace std;

int n;vector<int> a;

int cnt(int i, int j){
    int res=0,d=a[1]+j-(a[0]+i),c=a[0]+i;
    for (int k=0;k<n;k++){
        if (abs(a[k]-c)<=1){res+=abs(a[k]-c);}
        else return n+1;
        c+=d;
    }
    return res;
}

int solve(){
    if (n<=2) return 0;
    int res=n+1;
    for (int i=-1;i<=1;i++){
        for (int j=-1;j<=1;j++){
            res=min(res,cnt(i,j));
        }
    }
    if (res==n+1) return -1;
    return res;
}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>n;
    a.resize(n);
    for (int& i: a)cin>>i;
    cout<<solve();
    return 0;
}