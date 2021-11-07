#include <bits/stdc++.h>
typedef long long ll;
using namespace std;

int n,m;
vector<int> a,b;

bool check(int r){
    int ai=0;
    for (ll x: b){
        ll lo=x-r,hi=x+r;
        while (ai<a.size()&&a[ai]>=lo&&a[ai]<=hi) ++ai;
    }
    return ai>=a.size();
}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>n>>m;
    a.resize(n);
    b.resize(m);
    for (auto& i: a)cin>>i;
    for (auto& i: b)cin>>i;
    int lo=-1,hi=2e9;
    while (lo<hi-1){
        int mid=lo+(hi-lo)/2;
        if (check(mid)){
            hi=mid;
        } else lo=mid;
    }
    cout<<hi;
    return 0;
}