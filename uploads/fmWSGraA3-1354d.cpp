#include <bits/stdc++.h>
typedef long long ll;
using namespace std;

struct ST{
    vector<int> a;
    int size;
    ST(){}
    ST(int n){
        size=1;
        while (size<=n) size<<=1;
        a.resize(2*size);
    }
    void insert(int x){
        int s=size+x;
        while (s){
            ++a[s];
            s>>=1;
        }
    }
    void remove(int k){
        int s=1;
        while (s<size){
            --a[s];
            s<<=1;
            if (a[s]<k) {
                k-=a[s];
                ++s;
            }
        }
        --a[s];
    }
    int get(){
        for (int i=size;i<a.size();i++){
            if (a[i]>0) return i-size;
        }
        return 0;
    }
};

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n,q;cin>>n>>q;
    ST *st = new ST(n);
    for (int i=0;i<n;i++){
        int x;cin>>x;
        st->insert(x);
    }
    while (q--){
        int k;cin>>k;
        if (k<0) {st->remove(-k);}
        else st->insert(k);
    }
    cout<<st->get();
    return 0;
}